import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/context/AuthContext'
import LoginPage from './page'

// Mock useRouter
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock useAuth
const mockLoginWithEmail = jest.fn()
const mockLoginWithGoogle = jest.fn()

jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: null,
    loginWithEmail: mockLoginWithEmail,
    loginWithGoogle: mockLoginWithGoogle,
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login form', () => {
    render(<LoginPage />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('handles email login submission', async () => {
    mockLoginWithEmail.mockResolvedValueOnce(undefined)
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLoginWithEmail).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('shows error on failed login', async () => {
    mockLoginWithEmail.mockRejectedValueOnce(new Error('Invalid credentials'))
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrong' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLoginWithEmail).toHaveBeenCalled()
    })
  })

  it('has link to register page', () => {
    render(<LoginPage />)
    
    const registerLink = screen.getByText(/sign up/i)
    expect(registerLink).toBeInTheDocument()
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register')
  })

  it('has link to reset password', () => {
    render(<LoginPage />)
    
    const resetLink = screen.getByText(/forgot password/i)
    expect(resetLink).toBeInTheDocument()
    expect(resetLink.closest('a')).toHaveAttribute('href', '/reset-password')
  })
})
