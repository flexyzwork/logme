import { fetchGithubInstallationToken } from '@/services/logme/auth'
import { NextRequest, NextResponse } from 'next/server'

const VERCEL_API_BASE_URL = 'https://api.vercel.com'

export async function POST(req: NextRequest) {
  try {
    const {
      vercelToken,
      notionPageId,
      githubInstallationId,
      templateOwner,
      templateRepo,
      githubOwner,
      githubRepoName,
    } = await req.json()

    console.log('🚀 Vercel 배포 요청:', { vercelToken })
    console.log('githubInstallationId:', githubInstallationId)

    if (!githubInstallationId) {
      console.error('❌ GitHub Installation Id 없음: Vercel 배포 중단')
      return NextResponse.json(
        { error: 'GitHub Installation Id가 필요합니다. 온보딩을 완료해주세요.' },
        { status: 400 },
      )
    } 

    const githubInstallationToken = await fetchGithubInstallationToken(
      githubInstallationId)

    // Step 1: 템플릿 레포 복제
    const githubCreateRes = await fetch(
      `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${githubInstallationToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },

        body: JSON.stringify({
          owner: githubOwner,
          name: githubRepoName,
          description: 'Created by logme repository',
          include_all_branches: false,
          private: false,
        }),
      },
    )

    const githubCreateData = await githubCreateRes.json()

    if (!githubCreateRes.ok || !githubCreateData.full_name || !githubCreateData.id) {
      console.error('❌ GitHub 레포 생성 실패:', githubCreateData)
      return NextResponse.json(
        { error: 'GitHub 레포 복제 실패', details: githubCreateData },
        { status: 500 },
      )
    }

    const fullName = githubCreateData.full_name
    const repoId = githubCreateData.id

    console.log('🚀 Vercel 배포 요청:', { fullName, repoId, vercelToken, notionPageId })
    if (!vercelToken)
      return NextResponse.json({ error: 'Vercel API Token is required' }, { status: 400 })

    if (!notionPageId) {
      console.error('❌ Notion Page ID 없음: Vercel 배포 중단')
      return NextResponse.json(
        { error: 'Notion Page ID가 필요합니다. 온보딩을 완료해주세요.' },
        { status: 400 },
      )
    }

    // ✅ 1. Vercel 프로젝트 생성
    const projectResponse = await fetch(`${VERCEL_API_BASE_URL}/v9/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: githubRepoName,
        framework: 'nextjs',
        gitRepository: { repo: fullName, type: 'github' },
      }),
    })

    const projectData = await projectResponse.json()

    // ✅ HTTP 응답 상태 체크
    if (!projectResponse.ok) {
      console.error('❌ Vercel 프로젝트 생성 실패:', projectData)
      return NextResponse.json(
        { error: 'Vercel 프로젝트 생성 실패', details: projectData },
        { status: 500 },
      )
    }

    // ✅ 프로젝트 생성 성공 확인
    if (!projectData.id) {
      console.error('❌ Vercel API 응답 오류: 프로젝트 ID 없음', projectData)
      return NextResponse.json(
        { error: 'Vercel API 응답 오류', details: projectData },
        { status: 500 },
      )
    }

    console.log('✅ Vercel 프로젝트 생성 완료:', projectData)

    // ✅ 2. 환경 변수 추가 (notionPageId를 사용)
    const envResponse = await fetch(
      `${VERCEL_API_BASE_URL}/v10/projects/${projectData.id}/env?upsert=true`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            key: 'NODE_ENV',
            value: 'production',
            type: 'plain',
            target: ['production'],
          },
          {
            key: 'NEXT_PUBLIC_NODE_ENV',
            value: 'production',
            type: 'plain',
            target: ['production'],
          },
          {
            key: 'NEXT_PUBLIC_ROOT_NOTION_PAGE_ID',
            value: notionPageId,
            type: 'plain',
            target: ['production'],
          },
        ]),
      },
    )

    const envData = await envResponse.json()

    if (!envResponse.ok) {
      console.error('❌ 환경 변수 추가 실패:', envData)
      return NextResponse.json({ error: '환경 변수 추가 실패', details: envData }, { status: 500 })
    }

    console.log('✅ 환경 변수 추가 완료:', envData)

    // ✅ 3. Vercel 배포 시작

    const deployResponse = await fetch(`${VERCEL_API_BASE_URL}/v13/deployments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: projectData.name, // ✅ 프로젝트 이름 추가
        project: projectData.id, // ✅ 프로젝트 ID 추가
        target: 'production', // ✅ 배포 환경 (production)
        gitSource: {
          repo: fullName,
          repoId,
          type: 'github',
          ref: 'main',
        },
        meta: {
          NEXT_PUBLIC_ROOT_NOTION_PAGE_ID: notionPageId, // ✅ 환경 변수 설정 (Notion Page ID)
        },
        alias: [`${projectData.name}.vercel.app`], // ✅ Vercel 프로젝트 URL 자동 설정
      }),
    })

    const deployData = await deployResponse.json()

    // ✅ HTTP 응답 상태 확인
    if (!deployResponse.ok) {
      console.error('❌ Vercel 배포 API 응답 오류:', deployData)
      return NextResponse.json(
        { error: 'Vercel 배포 API 요청 실패', details: deployData },
        { status: 500 },
      )
    }

    // ✅ Vercel API에서 반환된 데이터 확인
    console.log('🔍 Vercel 배포 응답 데이터:', deployData)

    if (!deployData.url) {
      console.error('❌ Vercel 배포 실패: 배포 URL 없음', deployData)
      return NextResponse.json(
        { error: 'Vercel 배포 실패: 배포 URL이 없습니다.', details: deployData },
        { status: 500 },
      )
    }

    console.log('✅ Vercel 배포 완료:', deployData)
    return NextResponse.json(
      {
        message: '배포 완료',
        url: `https://${deployData.url}`,
        id: deployData.id,
        repoId,
        repoBranch: deployData.gitSource.ref,
        targetId: deployData.project.id,
        targetName: deployData.project.name,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('❌ Vercel 배포 실패:', error)
    return NextResponse.json({ error: 'Vercel 배포 실패' }, { status: 500 })
  }
}
