import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
  it('renders the home page', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', { name: /ohanadoc admin/i })
    expect(heading).toBeInTheDocument()
  })

  it('has correct structure', () => {
    const { container } = render(<Home />)
    
    expect(container.querySelector('main')).toBeInTheDocument()
    expect(container.querySelector('h1')).toHaveTextContent('OhanaDoc Admin')
  })
})