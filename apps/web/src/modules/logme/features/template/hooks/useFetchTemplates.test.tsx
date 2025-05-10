import { renderHook, waitFor } from '@testing-library/react'
import { useFetchTemplates } from './useFetchTemplates'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// uc804uc5ed fetch ubaa8ud0b9
global.fetch = jest.fn()

describe('useFetchTemplates', () => {
  let queryClient: QueryClient
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    // ud14cuc2a4ud2b8ub9c8ub2e4 uc0c8ub85cuc6b4 QueryClient uc0dduc131
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          // ud14cuc2a4ud2b8uc5d0uc11cub294 uc7acuc2dcub3c4ub97c ube44ud65cuc131ud654
          retry: false,
        },
      },
    })

    // fetch ubaa8ud0b9 ucd08uae30ud654
    ;(global.fetch as jest.Mock).mockReset()
  })

  test('ud15cud50cub9bf ub370uc774ud130ub97c uc131uacf5uc801uc73cub85c uac00uc838uc640uc57c ud568', async () => {
    const mockTemplates = [
      {
        id: 'template-1',
        name: 'Template 1',
        templateApp: { id: 'app-1', name: 'App 1' },
      },
      {
        id: 'template-2',
        name: 'Template 2',
        templateApp: { id: 'app-2', name: 'App 2' },
      },
    ]

    // fetch uc751ub2f5 ubaa8ud0b9
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockTemplates),
    })

    const { result } = renderHook(() => useFetchTemplates(), { wrapper })

    // ucd08uae30uc5d0ub294 ub85cub529 uc0c1ud0dc
    expect(result.current.isLoading).toBe(true)

    // ub370uc774ud130uac00 ub85cub4dcub420 ub54cuae4cuc9c0 ub300uae30
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // fetchuac00 uc62cubc14ub978 URLub85c ud638ucd9cub418uc5c8ub294uc9c0 ud655uc778
    expect(global.fetch).toHaveBeenCalledWith('/api/logme/templates', { credentials: 'include' })

    // ubc18ud658ub41c ub370uc774ud130 ud655uc778
    expect(result.current.data).toEqual(mockTemplates)
  })

  test('ud15cud50cub9bf ub370uc774ud130 uac00uc838uc624uae30 uc2e4ud328 uc2dc uc624ub958ub97c ubc18ud658ud574uc57c ud568', async () => {
    // fetch uc624ub958 ubaa8ud0b9
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    })

    const { result } = renderHook(() => useFetchTemplates(), { wrapper })

    // ub370uc774ud130uac00 ub85cub4dcub420 ub54cuae4cuc9c0 ub300uae30
    await waitFor(() => expect(result.current.isError).toBe(true))

    // uc624ub958 uba54uc2dcuc9c0 ud655uc778
    expect(result.current.error).toEqual(new Error('Failed to fetch template list'))
  })

  test('ub124ud2b8uc6ccud06c uc624ub958 ubc1cuc0dd uc2dc uc624ub958ub97c ubc18ud658ud574uc57c ud568', async () => {
    const networkError = new Error('Network error')
    // fetch ub124ud2b8uc6ccud06c uc624ub958 ubaa8ud0b9
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(networkError)

    const { result } = renderHook(() => useFetchTemplates(), { wrapper })

    // ub370uc774ud130uac00 ub85cub4dcub420 ub54cuae4cuc9c0 ub300uae30
    await waitFor(() => expect(result.current.isError).toBe(true))

    // uc624ub958 ud655uc778
    expect(result.current.error).toBe(networkError)
  })
})
