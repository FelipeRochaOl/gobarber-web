import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'

import SignUp from '../../pages/SignUp'

const mockedHistoryPush = jest.fn()
const mockedAddToast = jest.fn()

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
  }
})

jest.mock('../../hooks/Toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  }
})

jest.mock('../../services/api', () => {
  return {
    post: jest.fn(),
  }
})

describe('SignUp Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear()
    mockedAddToast.mockClear()
  })

  it('should be able to sign up', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Cadastrar')

    fireEvent.change(nameField, {
      target: { value: 'Felipe Rocha Oliveira' },
    })
    fireEvent.change(emailField, {
      target: { value: 'feliperochaoliveira@gmail.com' },
    })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalled()
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      )
    })
  })

  it('should not be able to sign up with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Cadastrar')

    fireEvent.change(nameField, { target: { value: 'Felipe Rocha Oliveira' } })
    fireEvent.change(emailField, { target: { value: 'not-valid-email' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled()
    })
  })

  /* it('should display an error if sign up fails', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Cadastrar')

    fireEvent.change(nameField, {
      target: { value: 'Felipe Rocha Oliveira' },
    })
    fireEvent.change(emailField, {
      target: { value: 'feliperochaoliveira@gmail.com' },
    })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      )
    })
  }) */
})
