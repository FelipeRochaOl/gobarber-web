import React, { createContext, useCallback, useContext, useState } from 'react'
import api from '../services/api'

interface User {
  id: string
  name: string
  email: string
  avatar_url: string
}

interface AuthState {
  token: string
  user: User
}

interface Credentials {
  email: string
  password: string
}

interface AuthContextState {
  user: User
  signIn(credentials: Credentials): Promise<void>
  signOut(): void
  updateUser(user: User): void
}

const AuthContext = createContext<AuthContextState>({} as AuthContextState)

const AuthProvider: React.FC = ({ children }) => {
  // Executada somente quando tem um refresh na página
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token')
    const user = localStorage.getItem('@GoBarber:user')

    if (token && user) {
      api.defaults.headers.authorization = `Bearer: ${token}`
      return { token, user: JSON.parse(user) }
    }

    return {} as AuthState
  })

  const signIn = useCallback(async ({ email, password }: Credentials) => {
    const response = await api.post('session', { email, password })
    const { token, user } = response.data

    localStorage.setItem('@GoBarber:token', token)
    localStorage.setItem('@GoBarber:user', JSON.stringify(user))

    api.defaults.headers.authorization = `Bearer: ${token}`

    setData({ token, user })
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token')
    localStorage.removeItem('@GoBarber:user')

    setData({} as AuthState)
  }, [])

  const updateUser = useCallback(
    (user: User) => {
      setData({
        token: data.token,
        user,
      })

      localStorage.setItem('@GoBarber:user', JSON.stringify(user))
    },
    [data.token],
  )

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextState {
  const context = useContext(AuthContext)

  return context
}

export { AuthProvider, useAuth }
