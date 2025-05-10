import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from './card'

describe('Card components', () => {
  describe('Card', () => {
    it('should render with default classes', () => {
      render(<Card data-testid="card">Card Content</Card>)
      const card = screen.getByTestId('card')
      
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('bg-card')
      expect(card).toHaveClass('text-card-foreground')
      expect(card).toHaveClass('rounded-xl')
      expect(card).toHaveClass('border')
      expect(card).toHaveClass('shadow-sm')
    })
    
    it('should merge custom className with default classes', () => {
      render(<Card data-testid="card" className="custom-class">Card Content</Card>)
      const card = screen.getByTestId('card')
      
      expect(card).toHaveClass('custom-class')
      expect(card).toHaveClass('bg-card')
    })
    
    it('should pass additional props to the div element', () => {
      render(<Card data-testid="card" aria-label="Card element">Card Content</Card>)
      const card = screen.getByTestId('card')
      
      expect(card).toHaveAttribute('aria-label', 'Card element')
      expect(card).toHaveAttribute('data-slot', 'card')
    })
  })
  
  describe('CardHeader', () => {
    it('should render with default classes', () => {
      render(<CardHeader data-testid="card-header">Header Content</CardHeader>)
      const header = screen.getByTestId('card-header')
      
      expect(header).toBeInTheDocument()
      expect(header).toHaveAttribute('data-slot', 'card-header')
    })
    
    it('should merge custom className with default classes', () => {
      render(<CardHeader data-testid="card-header" className="custom-header">Header Content</CardHeader>)
      const header = screen.getByTestId('card-header')
      
      expect(header).toHaveClass('custom-header')
    })
  })
  
  describe('CardTitle', () => {
    it('should render with default classes', () => {
      render(<CardTitle data-testid="card-title">Title</CardTitle>)
      const title = screen.getByTestId('card-title')
      
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('font-semibold')
      expect(title).toHaveAttribute('data-slot', 'card-title')
    })
  })
  
  describe('CardDescription', () => {
    it('should render with default classes', () => {
      render(<CardDescription data-testid="card-description">Description</CardDescription>)
      const description = screen.getByTestId('card-description')
      
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-muted-foreground')
      expect(description).toHaveClass('text-sm')
      expect(description).toHaveAttribute('data-slot', 'card-description')
    })
  })
  
  describe('CardAction', () => {
    it('should render with default classes', () => {
      render(<CardAction data-testid="card-action">Action</CardAction>)
      const action = screen.getByTestId('card-action')
      
      expect(action).toBeInTheDocument()
      expect(action).toHaveClass('col-start-2')
      expect(action).toHaveClass('row-span-2')
      expect(action).toHaveAttribute('data-slot', 'card-action')
    })
  })
  
  describe('CardContent', () => {
    it('should render with default classes', () => {
      render(<CardContent data-testid="card-content">Content</CardContent>)
      const content = screen.getByTestId('card-content')
      
      expect(content).toBeInTheDocument()
      expect(content).toHaveClass('px-6')
      expect(content).toHaveAttribute('data-slot', 'card-content')
    })
  })
  
  describe('CardFooter', () => {
    it('should render with default classes', () => {
      render(<CardFooter data-testid="card-footer">Footer</CardFooter>)
      const footer = screen.getByTestId('card-footer')
      
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('flex')
      expect(footer).toHaveClass('items-center')
      expect(footer).toHaveAttribute('data-slot', 'card-footer')
    })
  })
  
  it('should compose a complete card with all components', () => {
    render(
      <Card data-testid="complete-card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    )
    
    const card = screen.getByTestId('complete-card')
    expect(card).toBeInTheDocument()
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card Description')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Card Content')).toBeInTheDocument()
    expect(screen.getByText('Card Footer')).toBeInTheDocument()
  })
})
