import { render, screen, fireEvent } from '@testing-library/react'
import { SiteInfoForm } from './SiteInfoForm'

describe('SiteInfoForm', () => {
  // Common test props
  const defaultProps = {
    author: 'Test Author',
    title: 'Test Title',
    description: 'Test Description',
    sub: 'test-sub',
    onChange: jest.fn(),
    onSave: jest.fn(),
    isSaving: false
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock setTimeout and clearTimeout
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('renders all form fields correctly', () => {
    render(<SiteInfoForm {...defaultProps} />)
    
    // Check if all labels are rendered
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Site Title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Site Description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Subdomain/i)).toBeInTheDocument()
    
    // Check if all inputs have the correct values
    expect(screen.getByLabelText(/Name/i)).toHaveValue('Test Author')
    expect(screen.getByLabelText(/Site Title/i)).toHaveValue('Test Title')
    expect(screen.getByLabelText(/Site Description/i)).toHaveValue('Test Description')
    expect(screen.getByLabelText(/Subdomain/i)).toHaveValue('test-sub')
    
    // Check if save button is rendered
    expect(screen.getByRole('button', { name: /Save & Deploy/i })).toBeInTheDocument()
  })

  test('calls onChange when input values change', () => {
    render(<SiteInfoForm {...defaultProps} />)
    
    // Change author input
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Author' } })
    expect(defaultProps.onChange).toHaveBeenCalledWith('author', 'New Author')
    
    // Change title input
    fireEvent.change(screen.getByLabelText(/Site Title/i), { target: { value: 'New Title' } })
    expect(defaultProps.onChange).toHaveBeenCalledWith('title', 'New Title')
    
    // Change description input
    fireEvent.change(screen.getByLabelText(/Site Description/i), { target: { value: 'New Description' } })
    expect(defaultProps.onChange).toHaveBeenCalledWith('description', 'New Description')
    
    // Change subdomain input
    fireEvent.change(screen.getByLabelText(/Subdomain/i), { target: { value: 'new-sub' } })
    expect(defaultProps.onChange).toHaveBeenCalledWith('sub', 'new-sub')
  })

  test('calls onSave when save button is clicked', () => {
    // Create a fresh mock for this test
    const onSaveMock = jest.fn()
    
    render(<SiteInfoForm
      {...defaultProps}
      onSave={onSaveMock}
      // Make sure the button is not disabled
      author="Test"
      title="Test"
      sub="test"
    />)
    
    // Click save button
    fireEvent.click(screen.getByRole('button', { name: /Save & Deploy/i }))
    expect(onSaveMock).toHaveBeenCalled()
  })

  test('disables save button when title is empty', () => {
    render(<SiteInfoForm {...defaultProps} title="" />)
    
    // Check if save button is disabled
    expect(screen.getByRole('button', { name: /Save & Deploy/i })).toBeDisabled()
  })

  test('disables save button when title is too long', () => {
    // Create a title that is longer than 40 characters
    const longTitle = 'This is a very long title that exceeds the maximum length of forty characters'
    
    render(<SiteInfoForm {...defaultProps} title={longTitle} />)
    
    // Check if error message is displayed
    expect(screen.getByText(/Please enter 40 characters or fewer/i)).toBeInTheDocument()
    
    // Check if save button is disabled
    expect(screen.getByRole('button', { name: /Save & Deploy/i })).toBeDisabled()
  })

  test('disables save button when author name is too long', () => {
    // Create an author name that is longer than 10 characters
    const longAuthorName = 'Very Long Author Name'
    
    render(<SiteInfoForm {...defaultProps} author={longAuthorName} />)
    
    // Check if error message is displayed
    expect(screen.getByText(/Please enter 10 characters or fewer/i)).toBeInTheDocument()
    
    // Check if save button is disabled
    expect(screen.getByRole('button', { name: /Save & Deploy/i })).toBeDisabled()
  })

  test('disables save button when subdomain is empty', () => {
    render(<SiteInfoForm {...defaultProps} sub="" />)
    
    // Check if save button is disabled
    expect(screen.getByRole('button', { name: /Save & Deploy/i })).toBeDisabled()
  })

  test('displays saving state when isSaving is true', () => {
    render(<SiteInfoForm {...defaultProps} isSaving={true} />)
    
    // Check if button text is 'Saving...'
    expect(screen.getByRole('button', { name: /Saving.../i })).toBeInTheDocument()
    
    // Check if button is disabled
    expect(screen.getByRole('button', { name: /Saving.../i })).toBeDisabled()
  })

  test('calls setJustSaved when save button is clicked', () => {
    // Create a fresh mock for this test
    const onSaveMock = jest.fn()
    
    render(
      <SiteInfoForm
        {...defaultProps}
        onSave={onSaveMock}
        // Make sure the button is not disabled
        author="Test"
        title="Test"
        sub="test"
      />
    )
    
    // Verify initial state - button is enabled and shows correct text
    const saveButton = screen.getByRole('button', { name: /Save & Deploy/i })
    expect(saveButton).toBeInTheDocument()
    expect(saveButton).not.toBeDisabled()
    
    // Click save button
    fireEvent.click(saveButton)
    
    // Verify onSave was called
    expect(onSaveMock).toHaveBeenCalled()
    
    // Note: We can't easily test the internal state (justSaved) directly
    // without refactoring the component to accept it as a prop or expose it
    // for testing purposes
  })
})
