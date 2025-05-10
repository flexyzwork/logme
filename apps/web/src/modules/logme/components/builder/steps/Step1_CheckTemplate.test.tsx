import { render, screen, fireEvent } from '@testing-library/react'
import Step1_CheckTemplate from './Step1_CheckTemplate'

// 필요한 훅과 스토어 모킹
jest.mock('@/modules/logme/features/site/hooks/useSiteBuilderUI', () => ({
  useSiteBuilderUI: jest.fn()
}))

jest.mock('@/modules/logme/features/template/hooks/useTemplateCopyWatcher', () => ({
  useTemplateCopyWatcher: jest.fn()
}))

jest.mock('@/modules/logme/features/template/hooks/useTemplatePageOpener', () => ({
  useTemplatePageOpener: jest.fn()
}))

jest.mock('@/modules/logme/features/template/hooks/useTemplatePublicWatcher', () => ({
  useTemplatePublicWatcher: jest.fn()
}))

jest.mock('@/modules/logme/features/site/stores/builderStore', () => ({
  useBuilderStore: jest.fn()
}))

// 모킹된 훅 가져오기
import { useSiteBuilderUI } from '@/modules/logme/features/site/hooks/useSiteBuilderUI'
import { useTemplateCopyWatcher } from '@/modules/logme/features/template/hooks/useTemplateCopyWatcher'
import { useTemplatePageOpener } from '@/modules/logme/features/template/hooks/useTemplatePageOpener'
import { useTemplatePublicWatcher } from '@/modules/logme/features/template/hooks/useTemplatePublicWatcher'
import { useBuilderStore } from '@/modules/logme/features/site/stores/builderStore'

describe('Step1_CheckTemplate', () => {
  // 기본 모킹 설정
  const mockSetIsCheckingPublic = jest.fn()
  const mockSetNotionPopup = jest.fn()
  const mockSetBuilderStep = jest.fn()
  const mockOpenNotionPageUrl = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // useSiteBuilderUI 모킹
    ;(useSiteBuilderUI as jest.Mock).mockReturnValue({
      isCheckingPublic: false,
      setIsCheckingPublic: mockSetIsCheckingPublic,
      isCheckingCopy: false,
      setIsCheckingCopy: jest.fn(),
      hasChecked: false,
      setHasChecked: jest.fn(),
      hasCopiedTemplate: true,
      setIsCopyComplete: jest.fn(),
      notionPopup: null,
      setNotionPopup: mockSetNotionPopup,
    })

    // useBuilderStore 모킹
    ;(useBuilderStore as unknown as jest.Mock).mockReturnValue({
      setBuilderStep: mockSetBuilderStep,
      step: 1,
      siteId: 'test-site-id',
    })

    // useTemplatePageOpener 모킹
    ;(useTemplatePageOpener as jest.Mock).mockReturnValue({
      openNotionPageUrl: mockOpenNotionPageUrl,
    })

    // useTemplateCopyWatcher 모킹 - 단순히 호출만 추적
    ;(useTemplateCopyWatcher as jest.Mock).mockImplementation(() => {})

    // useTemplatePublicWatcher 모킹 - 단순히 호출만 추적
    ;(useTemplatePublicWatcher as jest.Mock).mockImplementation(() => {})
  })

  test('템플릿이 복사되었을 때 공유 버튼이 활성화되어야 함', () => {
    render(<Step1_CheckTemplate notionPageId="test-page-id" />)
    
    const shareButton = screen.getByText('🔗 Share Notion Template')
    expect(shareButton).toBeInTheDocument()
    expect(shareButton).not.toBeDisabled()
  })

  test('템플릿이 복사 중일 때 버튼이 비활성화되어야 함', () => {
    // hasCopiedTemplate을 false로 설정
    ;(useSiteBuilderUI as jest.Mock).mockReturnValue({
      isCheckingPublic: false,
      setIsCheckingPublic: mockSetIsCheckingPublic,
      isCheckingCopy: false,
      setIsCheckingCopy: jest.fn(),
      hasChecked: false,
      setHasChecked: jest.fn(),
      hasCopiedTemplate: false,
      setIsCopyComplete: jest.fn(),
      notionPopup: null,
      setNotionPopup: mockSetNotionPopup,
    })

    render(<Step1_CheckTemplate notionPageId="test-page-id" />)
    
    const loadingButton = screen.getByText('⏳ Copying template...')
    expect(loadingButton).toBeInTheDocument()
    expect(loadingButton).toBeDisabled()
  })

  test('공유 버튼 클릭 시 Notion 페이지를 열어야 함', () => {
    render(<Step1_CheckTemplate notionPageId="test-page-id" />)
    
    const shareButton = screen.getByText('🔗 Share Notion Template')
    fireEvent.click(shareButton)
    
    expect(mockSetIsCheckingPublic).toHaveBeenCalledWith(true)
    expect(mockOpenNotionPageUrl).toHaveBeenCalledWith({
      siteId: 'test-site-id',
      notionPageId: 'test-page-id',
      onWindow: mockSetNotionPopup,
    })
  })

  test('useTemplateCopyWatcher가 올바른 파라미터로 호출되어야 함', () => {
    const mockSetIsCheckingCopy = jest.fn()
    const mockSetHasChecked = jest.fn()
    const mockSetIsCopyComplete = jest.fn()
    
    // useSiteBuilderUI 모킹 업데이트
    ;(useSiteBuilderUI as jest.Mock).mockReturnValue({
      isCheckingPublic: false,
      setIsCheckingPublic: mockSetIsCheckingPublic,
      isCheckingCopy: false,
      setIsCheckingCopy: mockSetIsCheckingCopy,
      hasChecked: false,
      setHasChecked: mockSetHasChecked,
      hasCopiedTemplate: true,
      setIsCopyComplete: mockSetIsCopyComplete,
      notionPopup: null,
      setNotionPopup: mockSetNotionPopup,
    })
    
    render(<Step1_CheckTemplate notionPageId="test-page-id" />)
    
    // useTemplateCopyWatcher 호출 확인
    expect(useTemplateCopyWatcher).toHaveBeenCalledWith({
      enabled: true,
      notionPageId: 'test-page-id',
      onComplete: expect.any(Function),
      onError: expect.any(Function),
    })
    
    // onComplete 콜백 함수 테스트
    const onCompleteCallback = (useTemplateCopyWatcher as jest.Mock).mock.calls[0][0].onComplete
    onCompleteCallback()
    
    // 콜백 함수 호출 후 상태 변경 확인
    expect(mockSetIsCheckingCopy).toHaveBeenCalledWith(false)
    expect(mockSetHasChecked).toHaveBeenCalledWith(true)
    
    // setTimeout 테스트를 위한 타이머 모킹
    jest.useFakeTimers()
    onCompleteCallback()
    jest.advanceTimersByTime(1000)
    expect(mockSetIsCopyComplete).toHaveBeenCalledWith(true)
    jest.useRealTimers()
    
    // onError 콜백 함수 테스트
    const onErrorCallback = (useTemplateCopyWatcher as jest.Mock).mock.calls[0][0].onError
    onErrorCallback()
    expect(mockSetIsCheckingCopy).toHaveBeenCalledWith(false)
  })

  test('useTemplatePublicWatcher가 올바른 파라미터로 호출되어야 함', () => {
    // isCheckingPublic을 true로 설정하여 enabled 값이 true가 되도록 함
    ;(useSiteBuilderUI as jest.Mock).mockReturnValue({
      isCheckingPublic: true,
      setIsCheckingPublic: mockSetIsCheckingPublic,
      isCheckingCopy: false,
      setIsCheckingCopy: jest.fn(),
      hasChecked: false,
      setHasChecked: jest.fn(),
      hasCopiedTemplate: true,
      setIsCopyComplete: jest.fn(),
      notionPopup: { closed: false },
      setNotionPopup: mockSetNotionPopup,
    })
    
    render(<Step1_CheckTemplate notionPageId="test-page-id" />)
    
    // useTemplatePublicWatcher 호출 확인
    expect(useTemplatePublicWatcher).toHaveBeenCalledWith({
      enabled: true, // !!notionPageId && !!siteId && isCheckingPublic이 true가 되어야 함
      notionPageId: 'test-page-id',
      notionPopup: { closed: false },
      onComplete: expect.any(Function),
    })
    
    // onComplete 콜백 함수 테스트
    const onCompleteCallback = (useTemplatePublicWatcher as jest.Mock).mock.calls[0][0].onComplete
    onCompleteCallback()
    
    // 콜백 함수 호출 후 상태 변경 확인
    expect(mockSetIsCheckingPublic).toHaveBeenCalledWith(false)
    expect(mockSetBuilderStep).toHaveBeenCalledWith(2)
  })

  test('notionPageId가 없을 때 handleOpenNotion이 일찌 작동하지 않아야 함', () => {
    render(<Step1_CheckTemplate notionPageId="" />)
    
    const shareButton = screen.getByText('🔗 Share Notion Template')
    fireEvent.click(shareButton)
    
    // notionPageId가 없으므로 함수가 일찌 실행되지 않아야 함
    expect(mockSetIsCheckingPublic).not.toHaveBeenCalled()
    expect(mockOpenNotionPageUrl).not.toHaveBeenCalled()
  })
})
