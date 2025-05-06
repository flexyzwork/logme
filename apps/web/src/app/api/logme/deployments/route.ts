import { getAuthSession } from '@/shared/lib/auth'
import { decrypt } from '@/shared/lib/crypto'
import logger from '@/shared/lib/logger'
import { fetchGithubInstallationToken } from '@/modules/logme/features/repo/services/auth'
import { db } from '@repo/db'
import { NextRequest, NextResponse } from 'next/server'

const VERCEL_API_BASE_URL = 'https://api.vercel.com'

export async function POST(req: NextRequest) {
  try {
    const {
      notionPageId,
      githubInstallationId,
      templateOwner,
      templateRepo,
      githubOwner,
      githubRepoName,
      author,
      siteTitle,
      siteDescription,
      sub,
    } = await req.json()

    if (!githubInstallationId) {
      logger.log('error', '❌ Missing GitHub installation ID: aborting Vercel deployment')
      return NextResponse.json(
        { error: 'GitHub installation ID is required. Please complete onboarding.' },
        { status: 400 }
      )
    }

    const githubInstallationToken = await fetchGithubInstallationToken(githubInstallationId)

    // Step 1: Clone the template repository
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
      }
    )

    const githubCreateData = await githubCreateRes.json()

    if (!githubCreateRes.ok || !githubCreateData.full_name || !githubCreateData.id) {
      logger.log('error', '❌ Failed to generate GitHub repository:', githubCreateData)
      return NextResponse.json(
        { error: 'Failed to clone GitHub repository', details: githubCreateData },
        { status: 500 }
      )
    }

    const fullName = githubCreateData.full_name
    const repoId = githubCreateData.id
    logger.log('info', 'GitHub repository cloned successfully:', githubCreateData)

    // Step 2: Fetch Vercel API token
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userId = session.user.id
    const provider = await db.provider.findFirst({
      where: { userId, providerType: 'vercel' },
    })

    if (!provider) {
      return NextResponse.json({ error: 'Vercel provider not found' }, { status: 404 })
    }

    const providerExtended = await db.providerExtended.findFirst({
      where: {
        providerId: provider.id,
        extendedKey: 'token',
      },
    })

    const encryptedVercelTokenData = providerExtended?.extendedValue

    if (!encryptedVercelTokenData) {
      return NextResponse.json({ error: 'Vercel token not found' }, { status: 400 })
    }
    const vercelToken = decrypt(encryptedVercelTokenData)

    if (!vercelToken)
      return NextResponse.json({ error: 'Vercel API Token is required' }, { status: 400 })

    if (!notionPageId) {
      logger.log('error', '❌ Missing Notion Page ID: aborting Vercel deployment')
      return NextResponse.json(
        { error: 'Notion Page ID is required. Please complete onboarding.' },
        { status: 400 }
      )
    }

    // 1. Create Vercel project
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

    // Check HTTP response status
    if (!projectResponse.ok) {
      logger.log('error', '❌ Failed to create Vercel project:', projectData)
      return NextResponse.json(
        { error: 'Failed to create Vercel project', details: projectData },
        { status: 500 }
      )
    }

    // Confirm project creation success
    if (!projectData.id) {
      logger.log('error', '❌ Vercel API response error: missing project ID', projectData)
      return NextResponse.json(
        { error: 'Vercel API response error', details: projectData },
        { status: 500 }
      )
    }

    logger.log('info', 'Vercel project created successfully:', projectData)

    // 2. Add environment variables (using notionPageId)
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
          {
            key: 'NEXT_PUBLIC_SUB',
            value: sub,
            type: 'plain',
            target: ['production'],
          },
          {
            key: 'NEXT_PUBLIC_AUTHOR',
            value: author,
            type: 'plain',
            target: ['production'],
          },
          {
            key: 'NEXT_PUBLIC_SITE_TITLE',
            value: siteTitle,
            type: 'plain',
            target: ['production'],
          },
          {
            key: 'NEXT_PUBLIC_SITE_DESCRIPTION',
            value: siteDescription,
            type: 'plain',
            target: ['production'],
          },
        ]),
      }
    )

    const envData = await envResponse.json()

    if (!envResponse.ok) {
      logger.log('error', '❌ Failed to add environment variables:', envData)
      return NextResponse.json(
        { error: 'Failed to add environment variables', details: envData },
        { status: 500 }
      )
    }

    logger.log('info', 'Environment variables added successfully:', envData)

    // 3. Start Vercel deployment

    const deployResponse = await fetch(`${VERCEL_API_BASE_URL}/v13/deployments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: projectData.name, // Add project name
        project: projectData.id, // Add project ID
        target: 'production', // Deployment environment (production)
        gitSource: {
          repo: fullName,
          repoId,
          type: 'github',
          ref: 'main',
        },
        meta: {
          NEXT_PUBLIC_ROOT_NOTION_PAGE_ID: notionPageId, // Set environment variable (Notion Page ID)
          NODE_ENV: 'production', // Set environment variable (NODE_ENV)
          NEXT_PUBLIC_NODE_ENV: 'production', // Set environment variable (NEXT_PUBLIC_NODE_ENV)
          NEXT_PUBLIC_AUTHOR: notionPageId, // Set environment variable (Author)
        },
        alias: [`${projectData.name}.vercel.app`], // Automatically set Vercel project URL
      }),
    })

    const deployData = await deployResponse.json()

    // Check HTTP response status
    if (!deployResponse.ok) {
      logger.log('error', '❌ Vercel deployment API response error:', deployData)
      return NextResponse.json(
        { error: 'Failed to request deployment from Vercel', details: deployData },
        { status: 500 }
      )
    }

    // Check Vercel API returned data
    logger.log('info', '🔍 Vercel deployment response data:', deployData)

    if (!deployData.url) {
      logger.log('error', '❌ Vercel deployment failed: missing deployment URL', deployData)
      return NextResponse.json(
        { error: 'Vercel deployment failed: no deployment URL returned', details: deployData },
        { status: 500 }
      )
    }

    await db.deployment.create({
      data: {
        deployTarget: {
          connect: { id: deployData.project.id },
        },
        deployId: deployData.id,
        deployUrl: deployData.inspectorUrl,
        status: 'deploying',
      },
    })
    
    return NextResponse.json(
      {
        message: 'Deployment complete',
        url: `https://${deployData.url}`,
        deployUrl: deployData.inspectorUrl,
        id: deployData.id,
        repoId,
        repoBranch: deployData.gitSource.ref,
        targetId: deployData.project.id,
        targetName: deployData.project.name,
      },
      { status: 200 }
    )
  } catch (error) {
    logger.log('error', '❌ Vercel deployment failed:', { error })
    return NextResponse.json({ error: 'Failed to deploy to Vercel' }, { status: 500 })
  }
}
