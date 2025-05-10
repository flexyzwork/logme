import { render, screen } from '@testing-library/react'
import Step3_Deploy from './Step3_Deploy'

describe('Step3_Deploy', () => {
  test('renders deployment message correctly', () => {
    render(<Step3_Deploy />)
    
    // Check if the component renders the deployment message
    expect(screen.getByText(/Deploying to Vercel/i)).toBeInTheDocument()
    expect(screen.getByText(/Please wait a moment/i)).toBeInTheDocument()
    expect(screen.getByText(/This may take 2–3 minutes/i)).toBeInTheDocument()
  })

  test('has correct styling classes', () => {
    const { container } = render(<Step3_Deploy />)
    
    // Check if the main container has the expected classes
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveClass('flex')
    expect(mainDiv).toHaveClass('flex-col')
    expect(mainDiv).toHaveClass('items-center')
    expect(mainDiv).toHaveClass('gap-4')
    
    // Check if the paragraph has the expected classes
    const paragraph = screen.getByText(/Deploying to Vercel/i)
    expect(paragraph).toHaveClass('text-center')
    expect(paragraph).toHaveClass('text-gray-700')
    expect(paragraph).toHaveClass('text-sm')
  })
})
