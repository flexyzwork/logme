import { renderHook, act } from '@testing-library/react'
import { useTemplatePublicWatcher } from './useTemplatePublicWatcher'
import * as builderStore from '@/modules/logme/features/site/stores/builderStore'
import logger from '@/shared/lib/logger'

// 모킹
jest.mock('@/modules/logme/features/site/stores/builderStore', () => ({
  useBuilderStore: jest.fn()
}))

jest.mock('@/shared/lib/logger', () => ({
  log: jest.fn()
}))

// 전역 fetch 모킹
global.fetch = jest.fn()

describe('useTemplatePublicWatcher', () => {
  // 테스트 전 설정
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    
    // useBuilderStore 모킹
    jest.spyOn(builderStore, 'useBuilderStore').mockReturnValue({
      userId: 'test-user-id',
      templateId: 'test-template-id',
      setBuilderStep: jest.fn()
    })
    
    // fetch 모킹 초기화
    ;(global.fetch as jest.Mock).mockReset()
  })
  
  // 테스트 후 정리
  afterEach(() => {
    jest.useRealTimers()
  })
  
  test('enabled가 false일 때 API를 호출하지 않음', () => {
    renderHook(() => useTemplatePublicWatcher({
      enabled: false,
      notionPageId: 'test-page-id',
      notionPopup: null,
      onComplete: jest.fn()
    }))
    
    act(() => {
      jest.advanceTimersByTime(3000) // 2초 이상 진행
    })
    
    expect(global.fetch).not.toHaveBeenCalled()
  })
  
  test('notionPageId가 null일 때 API를 호출하지 않음', () => {
    renderHook(() => useTemplatePublicWatcher({
      enabled: true,
      notionPageId: null,
      notionPopup: null,
      onComplete: jest.fn()
    }))
    
    act(() => {
      jest.advanceTimersByTime(3000) // 2초 이상 진행
    })
    
    expect(global.fetch).not.toHaveBeenCalled()
  })
  
  test('템플릿이 공개되면 onComplete 콜백 호출', async () => {
    // fetch 응답 모킹
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ isPublic: true })
    })
    
    const onComplete = jest.fn()
    const mockNotionPopup = {
      close: jest.fn()
    } as unknown as Window
    
    renderHook(() => useTemplatePublicWatcher({
      enabled: true,
      notionPageId: 'test-page-id',
      notionPopup: mockNotionPopup,
      onComplete
    }))
    
    // 2초 후 첫 번째 API 호출
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    // 비동기 작업 완료 대기
    await act(async () => {
      await Promise.resolve()
    })
    
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith('/api/logme/templates/check-public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notionPageId: 'test-page-id',
        templateId: 'test-template-id'
      }),
    })
    
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(mockNotionPopup.close).toHaveBeenCalledTimes(1)
  })
  
  test('템플릿이 아직 공개되지 않았으면 2초 후 다시 확인', async () => {
    // 첫 번째 응답: 공개되지 않음
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ isPublic: false })
    })
    
    // 두 번째 응답: 공개됨
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ isPublic: true })
    })
    
    const onComplete = jest.fn()
    
    renderHook(() => useTemplatePublicWatcher({
      enabled: true,
      notionPageId: 'test-page-id',
      notionPopup: null,
      onComplete
    }))
    
    // 첫 번째 API 호출 (2초 후)
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    // 비동기 작업 완료 대기
    await act(async () => {
      await Promise.resolve()
    })
    
    // 두 번째 API 호출 (추가 2초 후)
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    // 비동기 작업 완료 대기
    await act(async () => {
      await Promise.resolve()
    })
    
    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })
  
  test('API 호출 중 오류 발생 시 로깅하고 계속 진행', async () => {
    const testError = new Error('API 호출 실패')
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(testError)
    
    renderHook(() => useTemplatePublicWatcher({
      enabled: true,
      notionPageId: 'test-page-id',
      notionPopup: null,
      onComplete: jest.fn()
    }))
    
    // 2초 후 API 호출
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    // 비동기 작업 완료 대기
    await act(async () => {
      await Promise.resolve()
    })
    
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(logger.log).toHaveBeenCalledWith('error', 'Error while checking public status:', { error: testError })
    
    // 오류 후에도 인터벌이 계속 작동하는지 확인
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ isPublic: true })
    })
    
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    await act(async () => {
      await Promise.resolve()
    })
    
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })
  
  test('컴포넌트 언마운트 시 인터벌 정리', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
    
    const { unmount } = renderHook(() => useTemplatePublicWatcher({
      enabled: true,
      notionPageId: 'test-page-id',
      notionPopup: null,
      onComplete: jest.fn()
    }))
    
    unmount()
    
    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})
