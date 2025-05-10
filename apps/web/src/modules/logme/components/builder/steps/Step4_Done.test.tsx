import { render, screen, fireEvent } from '@testing-library/react'
import Step4_Done from './Step4_Done'
import * as builderStore from '@/modules/logme/features/site/stores/builderStore'
import * as templatePageOpener from '@/modules/logme/features/template/hooks/useTemplatePageOpener'
import { useRouter } from 'next/navigation'

// Mock the dependencies
jest.mock('@/modules/logme/features/site/stores/builderStore', () => ({
  useBuilderStore: jest.fn()
}))

jest.mock('@/modules/logme/features/template/hooks/useTemplatePageOpener', () => ({
  useTemplatePageOpener: jest.fn()
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/modules/logme/components/common/ShareButton', () => ({
  __esModule: true,
  default: function MockShareButton({ url }: { url: string }) {
    return <div data-testid="share-button" data-url={url}>Share Button</div>
  }
}))

describe('Step4_Done', () => {
  // Common test setup
  const mockOpenNotionPageUrl = jest.fn()
  const mockRouterPush = jest.fn()
  const mockWindowOpen = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock useBuilderStore
    jest.spyOn(builderStore, 'useBuilderStore').mockReturnValue({
      siteId: 'test-site-id',
      notionPageId: 'test-page-id',
      sub: 'test-sub',
      templateId: 'test-template-id'
    })
    
    // Mock useTemplatePageOpener
    jest.spyOn(templatePageOpener, 'useTemplatePageOpener').mockReturnValue({
      openNotionPageUrl: mockOpenNotionPageUrl
    })
    
    // Mock useRouter
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush
    })
    
    // Mock window.open
    window.open = mockWindowOpen
  })
  
  test('renders success message and all buttons when sub is available', () => {
    render(<Step4_Done />)
    
    // Check if success message is displayed
    expect(screen.getByText(/🎉 Your blog has been deployed to Vercel!/i)).toBeInTheDocument()
    
    // Check if ShareButton is rendered with correct URL
    const shareButton = screen.getByTestId('share-button')
    expect(shareButton).toBeInTheDocument()
    expect(shareButton.getAttribute('data-url')).toBe('https://logme-test-sub.vercel.app')
    
    // Check if View Blog button is rendered
    expect(screen.getByText(/🌍 View Blog/i)).toBeInTheDocument()
    
    // Check if Edit Content button is rendered
    expect(screen.getByText(/📖 Edit Content/i)).toBeInTheDocument()
    
    // Check if Go to Dashboard button is rendered
    expect(screen.getByText(/🔙 Go to Dashboard/i)).toBeInTheDocument()
  })
  
  test('displays error message when sub is not available', () => {
    // Mock useBuilderStore with no sub
    jest.spyOn(builderStore, 'useBuilderStore').mockReturnValue({
      siteId: 'test-site-id',
      notionPageId: 'test-page-id',
      sub: null,
      templateId: 'test-template-id'
    })
    
    render(<Step4_Done />)
    
    // Check if error message is displayed
    expect(screen.getByText(/❌ Failed to generate blog URL/i)).toBeInTheDocument()
    
    // View Blog button should not be rendered
    expect(screen.queryByText(/🌍 View Blog/i)).not.toBeInTheDocument()
  })
  
  test('clicking View Blog button opens blog in new tab', () => {
    render(<Step4_Done />)
    
    // Click View Blog button
    fireEvent.click(screen.getByText(/🌍 View Blog/i))
    
    // Check if window.open was called with correct URL
    expect(mockWindowOpen).toHaveBeenCalledWith('https://logme-test-sub.vercel.app', '_blank')
  })
  
  test('clicking Edit Content button calls openNotionPageUrl with correct params', () => {
    render(<Step4_Done />)
    
    // Click Edit Content button
    fireEvent.click(screen.getByText(/📖 Edit Content/i))
    
    // Check if openNotionPageUrl was called with correct params
    expect(mockOpenNotionPageUrl).toHaveBeenCalledWith({
      siteId: 'test-site-id',
      notionPageId: 'test-page-id'
    })
  })
  
  test('clicking Go to Dashboard button navigates to dashboard', () => {
    render(<Step4_Done />)
    
    // Click Go to Dashboard button
    fireEvent.click(screen.getByText(/🔙 Go to Dashboard/i))
    
    // Check if router.push was called with correct path
    expect(mockRouterPush).toHaveBeenCalledWith('/dashboard')
  })
})
