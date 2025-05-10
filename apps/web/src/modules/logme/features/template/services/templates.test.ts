import { checkTemplateCopy, checkTemplatePublic, getNotionPageUrl } from './templates'

// global fetch 모킹
global.fetch = jest.fn()

describe('템플릿 서비스 함수', () => {
  // 테스트 전 설정
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkTemplateCopy', () => {
    test('올바른 URL과 헤더로 API를 호출해야 함', async () => {
      // fetch 응답 모킹
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ isCopied: true })
      })

      const notionPageId = 'test-page-id'
      const token = 'test-token'

      await checkTemplateCopy(notionPageId, token)

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/logme/templates/check-copy?notionPageId=${notionPageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    })

    test('API 응답을 올바르게 반환해야 함', async () => {
      const mockResponse = { isCopied: true }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      })

      const result = await checkTemplateCopy('test-page-id', 'test-token')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('checkTemplatePublic', () => {
    test('올바른 URL과 헤더로 API를 호출해야 함', async () => {
      // fetch 응답 모킹
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ isPublic: true })
      })

      const notionPageId = 'test-page-id'
      const token = 'test-token'

      await checkTemplatePublic(notionPageId, token)

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/logme/templates/check-public?notionPageId=${notionPageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    })

    test('API 응답을 올바르게 반환해야 함', async () => {
      const mockResponse = { isPublic: true }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      })

      const result = await checkTemplatePublic('test-page-id', 'test-token')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('getNotionPageUrl', () => {
    test('올바른 URL과 헤더로 API를 호출해야 함', async () => {
      // fetch 응답 모킹
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ url: 'https://notion.so/test-page' })
      })

      const notionPageId = 'test-page-id'
      const token = 'test-token'

      await getNotionPageUrl(notionPageId, token)

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/logme/templates/get-url?notionPageId=${notionPageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    })

    test('API 응답을 올바르게 반환해야 함', async () => {
      const mockResponse = { url: 'https://notion.so/test-page' }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      })

      const result = await getNotionPageUrl('test-page-id', 'test-token')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('오류 처리', () => {
    test('API 호출 중 오류 발생 시 예외를 전파해야 함', async () => {
      const testError = new Error('API 호출 실패')
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(testError)

      await expect(checkTemplateCopy('test-page-id', 'test-token'))
        .rejects
        .toThrow(testError)
    })
  })
})
