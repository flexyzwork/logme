import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Step0_SelectTemplate from './Step0_SelectTemplate'
import * as builderStore from '@/modules/logme/features/site/stores/builderStore'
import * as authStore from '@/shared/stores'
import * as useFetchTemplates from '@/modules/logme/features/template/hooks/useFetchTemplates'
import * as useCreateSite from '@/modules/logme/features/site/hooks/useCreateSite'
import * as utils from '@/shared/lib/utils'

// Mock the dependencies
jest.mock('@/modules/logme/features/site/stores/builderStore', () => ({
  useBuilderStore: jest.fn()
}))

jest.mock('@/shared/stores', () => ({
  useAuthStore: {
    getState: jest.fn()
  }
}))

jest.mock('@/modules/logme/features/template/hooks/useFetchTemplates', () => ({
  useFetchTemplates: jest.fn()
}))

jest.mock('@/modules/logme/features/site/hooks/useCreateSite', () => ({
  useCreateSite: jest.fn()
}))

jest.mock('@/shared/lib/utils', () => ({
  generateOAuthState: jest.fn(),
  cn: jest.fn((...inputs) => inputs.join(' '))
}))

jest.mock('@paralleldrive/cuid2', () => ({
  createId: jest.fn().mockReturnValue('test-site-id')
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage(props: any) {
    return (
      <img
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
        className={props.className}
        data-testid="mock-image"
      />
    )
  }
}))

describe('Step0_SelectTemplate', () => {
  // Common test setup
  const mockSetSiteId = jest.fn()
  const mockSetTemplateId = jest.fn()
  const mockCreateSiteDB = jest.fn().mockResolvedValue({})
  const mockSetNotionAuthState = jest.fn()
  
  // Mock templates data
  const mockTemplates = [
    {
      id: 'template-1',
      templateTitle: 'Test Template 1',
      templateDescription: 'Test Description 1',
      thumbnailUrl: '/test-image-1.jpg',
      templateApp: {
        appClientId: 'client-id-1',
        appRedirectUri: 'redirect-uri-1'
      }
    },
    {
      id: 'template-2',
      templateTitle: 'Test Template 2',
      templateDescription: 'Test Description 2',
      thumbnailUrl: '/test-image-2.jpg',
      templateApp: {
        appClientId: 'client-id-2',
        appRedirectUri: 'redirect-uri-2'
      }
    }
  ]
  
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock window.location.href
    // @ts-ignore - we're intentionally mocking this property
    delete window.location
    // @ts-ignore
    window.location = { href: '' }
    
    // Mock useBuilderStore
    jest.spyOn(builderStore, 'useBuilderStore').mockReturnValue({
      setSiteId: mockSetSiteId,
      setTemplateId: mockSetTemplateId,
      userId: 'test-user-id',
      siteId: null,
      templateId: null,
      reset: jest.fn()
    })
    
    // Mock useAuthStore
    ;(authStore.useAuthStore.getState as jest.Mock).mockReturnValue({
      setNotionAuthState: mockSetNotionAuthState
    })
    
    // Mock useCreateSite
    jest.spyOn(useCreateSite, 'useCreateSite').mockReturnValue({
      mutateAsync: mockCreateSiteDB,
      isLoading: false
    } as any)
    
    // Mock generateOAuthState
    jest.spyOn(utils, 'generateOAuthState').mockReturnValue('test-state')
  })
  
  test('renders loading state when templates are loading', () => {
    // Mock useFetchTemplates with loading state
    jest.spyOn(useFetchTemplates, 'useFetchTemplates').mockReturnValue({
      data: undefined,
      isLoading: true
    } as any)
    
    render(<Step0_SelectTemplate />)
    
    expect(screen.getByText('Loading templates...')).toBeInTheDocument()
  })
  
  test('renders templates when data is loaded', () => {
    // Mock useFetchTemplates with data
    jest.spyOn(useFetchTemplates, 'useFetchTemplates').mockReturnValue({
      data: mockTemplates,
      isLoading: false
    } as any)
    
    render(<Step0_SelectTemplate />)
    
    // Check if template titles are displayed
    expect(screen.getByText('Test Template 1')).toBeInTheDocument()
    expect(screen.getByText('Test Template 2')).toBeInTheDocument()
    
    // Check if template descriptions are displayed
    expect(screen.getByText('Test Description 1')).toBeInTheDocument()
    expect(screen.getByText('Test Description 2')).toBeInTheDocument()
    
    // Check if images are rendered
    const images = screen.getAllByTestId('mock-image')
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute('src', '/test-image-1.jpg')
    expect(images[1]).toHaveAttribute('src', '/test-image-2.jpg')
    
    // Check if select buttons are rendered
    const selectButtons = screen.getAllByText('Select')
    expect(selectButtons).toHaveLength(2)
  })
  
  test('handles template selection correctly', async () => {
    // Mock useFetchTemplates with data
    jest.spyOn(useFetchTemplates, 'useFetchTemplates').mockReturnValue({
      data: mockTemplates,
      isLoading: false
    } as any)
    
    render(<Step0_SelectTemplate />)
    
    // Click on the first template card
    const templateCards = screen.getAllByRole('button', { name: 'Select' })
    fireEvent.click(templateCards[0])
    
    // Check if site was created with correct data
    expect(mockCreateSiteDB).toHaveBeenCalledWith({
      id: 'test-site-id',
      siteTitle: '',
      siteDescription: '',
      templateId: 'template-1',
      userId: 'test-user-id',
      sub: 'test-site-id'
    })
    
    // Check if store values were updated
    expect(mockSetSiteId).toHaveBeenCalledWith('test-site-id')
    expect(mockSetTemplateId).toHaveBeenCalledWith('template-1')
    expect(mockSetNotionAuthState).toHaveBeenCalledWith('test-state')
    
    // Check if redirect to Notion OAuth was triggered
    await waitFor(() => {
      expect(window.location.href).toContain('https://api.notion.com/v1/oauth/authorize')
      expect(window.location.href).toContain('client_id=client-id-1')
      expect(window.location.href).toContain('redirect_uri=redirect-uri-1')
      expect(window.location.href).toContain('state=test-state')
    })
  })
  
  test('handles template with missing app information', () => {
    // Mock console.warn
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    
    // Mock useFetchTemplates with template missing app info
    const incompleteTemplate = [
      {
        id: 'template-3',
        templateTitle: 'Incomplete Template',
        templateDescription: 'Missing app info',
        thumbnailUrl: '/test-image-3.jpg',
        templateApp: null
      }
    ]
    
    jest.spyOn(useFetchTemplates, 'useFetchTemplates').mockReturnValue({
      data: incompleteTemplate,
      isLoading: false
    } as any)
    
    render(<Step0_SelectTemplate />)
    
    // Click on the template card
    const templateCard = screen.getByRole('button', { name: 'Select' })
    fireEvent.click(templateCard)
    
    // Check if warning was logged
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Template app information is missing:',
      expect.anything()
    )
    
    // Check that no redirect happened
    expect(window.location.href).toBe('')
    
    // Restore console.warn
    consoleWarnSpy.mockRestore()
  })
  
  test('renders fallback for missing template description', () => {
    // Mock useFetchTemplates with template missing description
    const templateWithoutDescription = [
      {
        id: 'template-4',
        templateTitle: 'No Description Template',
        templateDescription: null,
        thumbnailUrl: '/test-image-4.jpg',
        templateApp: {
          appClientId: 'client-id-4',
          appRedirectUri: 'redirect-uri-4'
        }
      }
    ]
    
    jest.spyOn(useFetchTemplates, 'useFetchTemplates').mockReturnValue({
      data: templateWithoutDescription,
      isLoading: false
    } as any)
    
    render(<Step0_SelectTemplate />)
    
    // Check if fallback description is displayed
    expect(screen.getByText('No description available.')).toBeInTheDocument()
  })
})
