import React, { createContext, useCallback, useContext, useState } from 'react'
import api from '../services/api'

interface AuthState {
  token: string
  user: Record<string, unknown>
}

interface Credentials {
  email: string
  password: string
}

interface AuthContextState {
  user: Record<string, unknown>
  signIn(credentials: Credentials): Promise<void>
  signOut(): void
}

const AuthContext = createContext<AuthContextState>({} as AuthContextState)

const AuthProvider: React.FC = ({ children }) => {
  // Executada somente quando tem um refresh na página
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token')
    const user = localStorage.getItem('@GoBarber:user')

    if (token && user) {
      return { token, user: JSON.parse(user) }
    }

    return {} as AuthState
  })

  const signIn = useCallback(async ({ email, password }: Credentials) => {
    const response = await api.post('session', { email, password })
    const { token, user } = response.data

    localStorage.setItem('@GoBarber:token', token)
    localStorage.setItem('@GoBarber:user', JSON.stringify(user))

    setData({ token, user })
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token')
    localStorage.removeItem('@GoBarber:user')

    setData({} as AuthState)
  }, [])

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextState {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }
