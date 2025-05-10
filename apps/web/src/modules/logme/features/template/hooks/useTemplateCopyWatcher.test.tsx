import { renderHook, act } from '@testing-library/react'
import { useTemplateCopyWatcher } from './useTemplateCopyWatcher'
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

describe('useTemplateCopyWatcher', () => {
  // 테스트 전 설정
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    
    // useBuilderStore 모킹
    jest.spyOn(builderStore, 'useBuilderStore').mockReturnValue({
      userId: 'test-user-id',
      templateId: 'test-template-id',
      siteId: null,
      setSiteId: jest.fn(),
      setTemplateId: jest.fn(),
      reset: jest.fn()
    })
    
    // fetch 모킹 초기화
    ;(global.fetch as jest.Mock).mockReset()
  })
  
  // 테스트 후 정리
  afterEach(() => {
    jest.useRealTimers()
  })
  
  test('enabled가 false일 때 API를 호출하지 않음', () => {
    renderHook(() => useTemplateCopyWatcher({
      enabled: false,
      notionPageId: 'test-page-id',
      onComplete: jest.fn(),
      onError: jest.fn()
    }))
    
    act(() => {
      jest.advanceTimersByTime(6000) // 5초 이상 진행
    })
    
    expect(global.fetch).not.toHaveBeenCalled()
  })
  
  test('notionPageId가 null일 때 API를 호출하지 않음', () => {
    renderHook(() => useTemplateCopyWatcher({
      enabled: true,
      notionPageId: null,
      onComplete: jest.fn(),
      onError: jest.fn()
    }))
    
    act(() => {
      jest.advanceTimersByTime(6000) // 5초 이상 진행
    })
    
    expect(global.fetch).not.toHaveBeenCalled()
  })
  
  test('템플릿 복사가 완료되면 onComplete 콜백 호출', async () => {
    // fetch 응답 모킹
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ isCopied: true })
    })
    
    const onComplete = jest.fn()
    
    renderHook(() => useTemplateCopyWatcher({
      enabled: true,
      notionPageId: 'test-page-id',
      onComplete,
      onError: jest.fn()
    }))
    
    // 5초 후 첫 번째 API 호출
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    
    // 비동기 작업 완료 대기
    await act(async () => {
      await Promise.resolve()
    })
    
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith('/api/logme/templates/check-copy', {
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
  })
  
  test('템플릿 복사가 진행 중이면 5초 후 다시 확인', async () => {
    // 첫 번째 응답: 복사 진행 중
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ isCopied: false })
    })
    
    // 두 번째 응답: 복사 완료
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ isCopied: true })
    })
    
    const onComplete = jest.fn()
    
    renderHook(() => useTemplateCopyWatcher({
      enabled: true,
      notionPageId: 'test-page-id',
      onComplete,
      onError: jest.fn()
    }))
    
    // 첫 번째 API 호출 (5초 후)
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    
    // 비동기 작업 완료 대기
    await act(async () => {
      await Promise.resolve()
    })
    
    // 두 번째 API 호출 (추가 5초 후)
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    
    // 비동기 작업 완료 대기
    await act(async () => {
      await Promise.resolve()
    })
    
    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })
  
  test('API 호출 중 오류 발생 시 onError 콜백 호출', async () => {
    const testError = new Error('API 호출 실패')
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(testError)
    
    const onError = jest.fn()
    
    renderHook(() => useTemplateCopyWatcher({
      enabled: true,
      notionPageId: 'test-page-id',
      onComplete: jest.fn(),
      onError
    }))
    
    // 5초 후 API 호출
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    
    // 비동기 작업 완료 대기
    await act(async () => {
      await Promise.resolve()
    })
    
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(testError)
    expect(logger.log).toHaveBeenCalledWith('error', '❌ Error while checking template copy status:', { error: testError })
  })
  
  test('최대 시도 횟수(10회) 도달 시 더 이상 API 호출하지 않음', async () => {
    // 모든 응답이 복사 진행 중 상태
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ isCopied: false })
    })
    
    renderHook(() => useTemplateCopyWatcher({
      enabled: true,
      notionPageId: 'test-page-id',
      onComplete: jest.fn(),
      onError: jest.fn()
    }))
    
    // 11번의 타이머 진행 (초기 + 10회 시도)
    for (let i = 0; i < 11; i++) {
      act(() => {
        jest.advanceTimersByTime(5000)
      })
      
      // 비동기 작업 완료 대기
      await act(async () => {
        await Promise.resolve()
      })
    }
    
    // 최대 10회만 호출되어야 함
    expect(global.fetch).toHaveBeenCalledTimes(10)
  })
  
  test('컴포넌트 언마운트 시 타이머 정리', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    
    const { unmount } = renderHook(() => useTemplateCopyWatcher({
      enabled: true,
      notionPageId: 'test-page-id',
      onComplete: jest.fn(),
      onError: jest.fn()
    }))
    
    unmount()
    
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
