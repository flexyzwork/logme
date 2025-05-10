/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react'
import { useTemplatePageOpener } from './useTemplatePageOpener'
import * as builderStore from '@/modules/logme/features/site/stores/builderStore'
import * as contentSourceHooks from '@/modules/logme/features/contentSource/hooks/useUpdateContentSource'
import logger from '@/shared/lib/logger'

// ubaa8ud0b9
jest.mock('@/modules/logme/features/site/stores/builderStore', () => ({
  useBuilderStore: jest.fn()
}))

jest.mock('@/modules/logme/features/contentSource/hooks/useUpdateContentSource', () => ({
  useUpdateContentSource: jest.fn()
}))

jest.mock('@/shared/lib/logger', () => ({
  log: jest.fn()
}))

// uc804uc5ed fetch ubaa8ud0b9
global.fetch = jest.fn()

describe('useTemplatePageOpener', () => {
  // ud14cuc2a4ud2b8 uc804 uc124uc815
  beforeEach(() => {
    jest.clearAllMocks()
    
    // useBuilderStore ubaa8ud0b9
    jest.spyOn(builderStore, 'useBuilderStore').mockReturnValue({
      templateId: 'test-template-id'
    })
    
    // useUpdateContentSource ubaa8ud0b9
    jest.spyOn(contentSourceHooks, 'useUpdateContentSource').mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue({})
    } as any)
    
    // fetch ubaa8ud0b9 ucd08uae30ud654
    ;(global.fetch as jest.Mock).mockReset()
    
    // window.open ubaa8ud0b9
    window.open = jest.fn().mockReturnValue({} as Window)
  })
  
  test('openNotionPageUrluc774 uc62cubc14ub978 ud30cub77cubbf8ud130ub85c APIub97c ud638ucd9cud574uc57c ud568', async () => {
    // fetch uc751ub2f5 ubaa8ud0b9
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ url: 'https://notion.so/test-page' })
    })
    
    const { result } = renderHook(() => useTemplatePageOpener())
    const onWindow = jest.fn()
    
    await result.current.openNotionPageUrl({
      siteId: 'test-site-id',
      notionPageId: 'test-page-id',
      onWindow
    })
    
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith('/api/logme/templates/get-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notionPageId: 'test-page-id',
        templateId: 'test-template-id'
      }),
    })
  })
  
  test('API uc751ub2f5uc5d0 URLuc774 uc788uc73cuba74 uc0c8 ucc3duc744 uc5f4uace0 onWindow ucf5cubc31uc744 ud638ucd9cud574uc57c ud568', async () => {
    const mockUrl = 'https://notion.so/test-page'
    const mockWindow = { test: 'window' } as unknown as Window
    
    // fetch uc751ub2f5 ubaa8ud0b9
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ url: mockUrl })
    })
    
    // window.open ubaa8ud0b9
    ;(window.open as jest.Mock).mockReturnValueOnce(mockWindow)
    
    const { result } = renderHook(() => useTemplatePageOpener())
    const onWindow = jest.fn()
    const updateContentSourceDB = (contentSourceHooks.useUpdateContentSource() as any).mutateAsync
    
    await result.current.openNotionPageUrl({
      siteId: 'test-site-id',
      notionPageId: 'test-page-id',
      onWindow
    })
    
    expect(updateContentSourceDB).toHaveBeenCalledWith({
      sourceId: 'test-page-id',
      sourceUrl: mockUrl
    })
    expect(window.open).toHaveBeenCalledWith(mockUrl, '_blank')
    expect(onWindow).toHaveBeenCalledWith(mockWindow)
  })
  
  test('API uc751ub2f5uc5d0 URLuc774 uc5c6uc73cuba74 uacbduace0ub97c ud45cuc2dcud574uc57c ud568', async () => {
    // fetch uc751ub2f5 ubaa8ud0b9 (URL uc5c6uc74c)
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ url: null })
    })
    
    // alert ubaa8ud0b9
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})
    
    const { result } = renderHook(() => useTemplatePageOpener())
    
    await result.current.openNotionPageUrl({
      siteId: 'test-site-id',
      notionPageId: 'test-page-id',
      onWindow: jest.fn()
    })
    
    expect(alertMock).toHaveBeenCalledWith('❌ Failed to load the Notion page.')
    expect(window.open).not.toHaveBeenCalled()
  })
  
  test('API ud638ucd9c uc911 uc624ub958 ubc1cuc0dd uc2dc onError ucf5cubc31uc744 ud638ucd9cud574uc57c ud568', async () => {
    const testError = new Error('API ud638ucd9c uc2e4ud328')
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(testError)
    
    const { result } = renderHook(() => useTemplatePageOpener())
    const onError = jest.fn()
    
    await result.current.openNotionPageUrl({
      siteId: 'test-site-id',
      notionPageId: 'test-page-id',
      onError
    })
    
    expect(logger.log).toHaveBeenCalledWith('error', '❌ Failed to fetch Notion page URL:', { error: testError })
    expect(onError).toHaveBeenCalledWith(testError)
  })
})
