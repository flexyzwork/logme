/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Step2_InputSiteInfo from './Step2_InputSiteInfo'
import * as siteHooks from '@/modules/logme/features/site/hooks/useSiteBuilderUI'
import * as updateSiteHook from '@/modules/logme/features/site/hooks/useUpdateSite'
import * as builderStore from '@/modules/logme/features/site/stores/builderStore'
import * as deployHook from '@/modules/logme/features/deployment/hooks/useDeployExecutor'
import * as nextAuth from 'next-auth/react'
import * as loggerModule from '@/shared/lib/logger'

// 모킹
jest.mock('@/modules/logme/features/site/hooks/useSiteBuilderUI', () => ({
  useSiteBuilderUI: jest.fn(),
}))

jest.mock('@/modules/logme/features/site/hooks/useUpdateSite', () => ({
  useUpdateSite: jest.fn(),
}))

jest.mock('@/modules/logme/features/site/stores/builderStore', () => ({
  useBuilderStore: jest.fn(),
}))

jest.mock('@/modules/logme/features/deployment/hooks/useDeployExecutor', () => ({
  useDeployExecutor: jest.fn(),
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

jest.mock('@/shared/lib/logger', () => ({
  log: jest.fn(),
}))

// SiteInfoForm 모킹
jest.mock('@/modules/logme/components/builder/forms/SiteInfoForm', () => ({
  SiteInfoForm: jest.fn().mockImplementation(({ onChange, onSave }) => (
    <div data-testid="site-info-form">
      <input
        data-testid="author-input"
        onChange={(e) => onChange('author', e.target.value)}
      />
      <input
        data-testid="title-input"
        onChange={(e) => onChange('title', e.target.value)}
      />
      <input
        data-testid="description-input"
        onChange={(e) => onChange('description', e.target.value)}
      />
      <input
        data-testid="sub-input"
        onChange={(e) => onChange('sub', e.target.value)}
      />
      <button data-testid="save-button" onClick={onSave}>
        Save
      </button>
    </div>
  )),
}))

// 전역 fetch 모킹
global.fetch = jest.fn()

describe('Step2_InputSiteInfo', () => {
  // 전역 변수 선언
  const mockStartDeploy = jest.fn().mockImplementation(() => {
    // Promise 반환
    return Promise.resolve();
  });
  
  // 테스트 전 설정
  beforeEach(() => {
    jest.clearAllMocks()
    
    // useSiteBuilderUI 모킹
    jest.spyOn(siteHooks, 'useSiteBuilderUI').mockReturnValue({
      isCheckingCopy: false,
      setIsCheckingCopy: jest.fn(),
      hasChecked: false,
      setHasChecked: jest.fn(),
      hasCopiedTemplate: false,
      setIsCopyComplete: jest.fn(),
      notionPopup: null,
      setNotionPopup: jest.fn(),
      isCheckingPublic: false,
      setIsCheckingPublic: jest.fn(),
      isDeploying: false,
      setIsDeploying: jest.fn()
    })
    
    // useUpdateSite 모킹
    jest.spyOn(updateSiteHook, 'useUpdateSite').mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue({}),
    } as any)
    
    // useBuilderStore 모킹
    jest.spyOn(builderStore, 'useBuilderStore').mockReturnValue({
      siteId: 'test-site-id',
      setBuilderStep: jest.fn(),
      setDeployUrl: jest.fn(),
      setSub: jest.fn(),
      setGitRepoUrl: jest.fn(),
      setSiteTitle: jest.fn(),
      setSiteDescription: jest.fn(),
    } as unknown as any)
    
    // useDeployExecutor 모킹
    mockStartDeploy.mockClear();
    (deployHook.useDeployExecutor as jest.Mock).mockReturnValue({
      startDeploy: mockStartDeploy
    })
    
    // useSession 모킹
    jest.spyOn(nextAuth, 'useSession').mockReturnValue({
      data: {
        user: {
          id: 'test-user-id',
          name: 'Test User',
        },
      },
      status: 'authenticated',
    } as any)
    
    // fetch 모킹 초기화
    ;(global.fetch as jest.Mock).mockReset()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ exists: false }),
    })
    
    // alert 모킹
    window.alert = jest.fn()
  })
  
  test('컴포넌트가 올바르게 렌더링되어야 함', () => {
    render(<Step2_InputSiteInfo />)
    
    expect(screen.getByTestId('site-info-form')).toBeInTheDocument()
    expect(screen.getByTestId('save-button')).toBeInTheDocument()
  })
  
  test('사용자 정보가 세션에서 가져와야 함', () => {
    render(<Step2_InputSiteInfo />)
    
    // 세션에서 사용자 이름을 가져와야 함
    expect(nextAuth.useSession).toHaveBeenCalled()
  })
  
  test('사이트 정보 입력 후 저장 버튼 클릭 시 저장 및 배포 과정이 시작되어야 함', async () => {
    render(<Step2_InputSiteInfo />)
    
    // 사이트 정보 입력
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Test Site' } })
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Test Description' } })
    fireEvent.change(screen.getByTestId('sub-input'), { target: { value: 'test-sub' } })
    
    // uc800uc7a5 ubc84ud2bc ud074ub9ad
    fireEvent.click(screen.getByTestId('save-button'))
    
    // 서브도메인 사용 가능 여부 확인 API 호출 확인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/logme/domains/check-sub?sub=test-sub')
    })
    
    // 사이트 업데이트 함수 호출 확인
    const updateSiteMock = (updateSiteHook.useUpdateSite() as any).mutateAsync
    await waitFor(() => {
      expect(updateSiteMock).toHaveBeenCalledWith({
        id: 'test-site-id',
        sub: 'test-sub',
        siteTitle: 'Test Site',
        siteDescription: 'Test Description',
      })
    })
    
    // 배포 시작 함수 호출 확인
    await waitFor(() => {
      expect(mockStartDeploy).toHaveBeenCalled()
      // 첫 번째 인자만 확인
      expect(mockStartDeploy.mock.calls[0][0]).toEqual({
        sub: 'test-sub',
        siteTitle: 'Test Site',
        siteDescription: 'Test Description',
        author: 'Test User'
      })
    })
  })
  
  test('예약된 서브도메인을 사용하려고 할 때 경고가 표시되어야 함', async () => {
    render(<Step2_InputSiteInfo />)
    
    // admin으로 시작하는 서브도메인 입력
    fireEvent.change(screen.getByTestId('sub-input'), { target: { value: 'admin-sub' } })
    
    // uc800uc7a5 ubc84ud2bc ud074ub9ad
    fireEvent.click(screen.getByTestId('save-button'))
    
    // uacbduace0 ud45cuc2dc ud655uc778
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('❌ This subdomain is reserved and cannot be used.')
    })
  })
  
  test('이미 사용 중인 서브도메인을 사용하려고 할 때 경고가 표시되어야 함', async () => {
    // 이미 사용 중인 서브도메인 응답 모킹
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ exists: true }),
    })
    
    render(<Step2_InputSiteInfo />)
    
    // 서브도메인 입력
    fireEvent.change(screen.getByTestId('sub-input'), { target: { value: 'existing-sub' } })
    
    // uc800uc7a5 ubc84ud2bc ud074ub9ad
    fireEvent.click(screen.getByTestId('save-button'))
    
    // API 호출 확인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/logme/domains/check-sub?sub=existing-sub')
    })
    
    // uacbduace0 ud45cuc2dc ud655uc778
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('❌ This subdomain is already in use.')
    })
  })
  
  test('사용자가 로그인하지 않은 경우 경고가 표시되어야 함', async () => {
    // 로그인하지 않은 상태 모킹
    jest.spyOn(nextAuth, 'useSession').mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    } as any)
    
    render(<Step2_InputSiteInfo />)
    
    // uc800uc7a5 ubc84ud2bc ud074ub9ad
    fireEvent.click(screen.getByTestId('save-button'))
    
    // 경고 표시 확인
    expect(window.alert).toHaveBeenCalledWith('❌ Sign-in required.')
  })

  test('siteId가 없을 때 오류 로그가 기록되어야 함', async () => {
    // siteId가 없는 상태 모킹
    jest.spyOn(builderStore, 'useBuilderStore').mockReturnValue({
      siteId: null, // siteId를 null로 설정
      setBuilderStep: jest.fn(),
      setDeployUrl: jest.fn(),
      setSub: jest.fn(),
      setGitRepoUrl: jest.fn(),
      setSiteTitle: jest.fn(),
      setSiteDescription: jest.fn(),
    } as unknown as ReturnType<typeof builderStore.useBuilderStore>)
    
    // logger 모듈 스파이 설정
    const logSpy = jest.spyOn(loggerModule.default, 'log')
    
    render(<Step2_InputSiteInfo />)
    
    // 서브도메인 입력
    fireEvent.change(screen.getByTestId('sub-input'), { target: { value: 'test-sub' } })
    
    // 저장 버튼 클릭
    fireEvent.click(screen.getByTestId('save-button'))
    
    // 서브도메인 체크 API 호출 확인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/logme/domains/check-sub?sub=test-sub')
    })
    
    // 오류 로그 기록 확인 - 마지막 호출을 확인
    await waitFor(() => {
      // 마지막 호출이 오류 로그인지 확인
      const lastCallIndex = logSpy.mock.calls.length - 1;
      expect(logSpy.mock.calls[lastCallIndex][0]).toBe('error');
      expect(logSpy.mock.calls[lastCallIndex][1]).toBe('❌ Site ID is missing.');
    })
    
    // updateSiteDB와 startDeploy가 호출되지 않아야 함
    const updateSiteMock = (updateSiteHook.useUpdateSite() as ReturnType<typeof updateSiteHook.useUpdateSite>).mutateAsync
    expect(updateSiteMock).not.toHaveBeenCalled()
    expect(mockStartDeploy).not.toHaveBeenCalled()
  })
  
  test('startDeploy 콜백 함수들이 올바르게 호출되어야 함', async () => {
    // 모킹된 함수들
    const mockSetIsDeploying = jest.fn()
    const mockSetBuilderStep = jest.fn()
    const mockSetDeployUrl = jest.fn()
    const mockSetSub = jest.fn()
    const mockSetSiteTitle = jest.fn()
    const mockSetSiteDescription = jest.fn()
    const mockSetGitRepoUrl = jest.fn()
    
    // useSiteBuilderUI 모킹 업데이트
    jest.spyOn(siteHooks, 'useSiteBuilderUI').mockReturnValue({
      isCheckingCopy: false,
      setIsCheckingCopy: jest.fn(),
      hasChecked: false,
      setHasChecked: jest.fn(),
      hasCopiedTemplate: false,
      setIsCopyComplete: jest.fn(),
      notionPopup: null,
      setNotionPopup: jest.fn(),
      isCheckingPublic: false,
      setIsCheckingPublic: jest.fn(),
      isDeploying: false,
      setIsDeploying: mockSetIsDeploying
    })
    
    // useBuilderStore 모킹 업데이트
    jest.spyOn(builderStore, 'useBuilderStore').mockReturnValue({
      siteId: 'test-site-id',
      setBuilderStep: mockSetBuilderStep,
      setDeployUrl: mockSetDeployUrl,
      setSub: mockSetSub,
      setGitRepoUrl: mockSetGitRepoUrl,
      setSiteTitle: mockSetSiteTitle,
      setSiteDescription: mockSetSiteDescription,
    } as unknown as ReturnType<typeof builderStore.useBuilderStore>)
    
    // startDeploy 모킹 - 콜백 함수 실행 시뮬레이션
    mockStartDeploy.mockImplementation((data, onStart, onComplete) => {
      // onStart 콜백 호출
      onStart()
      // onComplete 콜백 호출 (배포 URL과 Git 저장소 URL 전달)
      onComplete('https://test-deploy-url.vercel.app', 'https://github.com/test/repo')
      return Promise.resolve()
    })
    
    render(<Step2_InputSiteInfo />)
    
    // 사이트 정보 입력
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Test Site' } })
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Test Description' } })
    fireEvent.change(screen.getByTestId('sub-input'), { target: { value: 'test-sub' } })
    
    // 저장 버튼 클릭
    fireEvent.click(screen.getByTestId('save-button'))
    
    // 서브도메인 체크 API 호출 확인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/logme/domains/check-sub?sub=test-sub')
    })
    
    // startDeploy 호출 확인
    expect(mockStartDeploy).toHaveBeenCalled()
    
    // onStart 콜백 호출 확인 (setIsDeploying)
    expect(mockSetIsDeploying).toHaveBeenCalledWith(true)
    
    // onComplete 콜백 호출 확인
    expect(mockSetDeployUrl).toHaveBeenCalledWith('https://test-deploy-url.vercel.app')
    expect(mockSetSub).toHaveBeenCalledWith('test-sub')
    expect(mockSetSiteTitle).toHaveBeenCalledWith('Test Site')
    expect(mockSetSiteDescription).toHaveBeenCalledWith('Test Description')
    expect(mockSetGitRepoUrl).toHaveBeenCalledWith('https://github.com/test/repo')
    expect(mockSetBuilderStep).toHaveBeenCalledWith(4)
  })
})
