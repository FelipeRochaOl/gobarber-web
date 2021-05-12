import { renderHook, act } from '@testing-library/react-hooks'
import MockAdapter from 'axios-mock-adapter'

import { AuthProvider, useAuth } from '../../hooks/Auth'
import api from '../../services/api'

const apiMock = new MockAdapter(api)

const apiResponse = {
  user: {
    id: 'user-123',
    name: 'Felipe Rocha',
    email: 'feliperochaoliveira@gmail.com',
    avatar_url: 'image.jpg',
  },
  token: 'token-api-1',
}
const { user, token } = apiResponse

describe('Auth hooks', () => {
  it('should be able to sign in', async () => {
    apiMock.onPost('session').reply(200, apiResponse)

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    result.current.signIn({
      email: 'feliperochaoliveira@gmail.com',
      password: '123456',
    })

    await waitForNextUpdate()

    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:token', token)
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    )
    expect(result.current.user.email).toEqual('feliperochaoliveira@gmail.com')
  })

  it('should restore saved data from storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return token
        case '@GoBarber:user':
          return JSON.stringify(user)
        default:
          return null
      }
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.user.email).toEqual('feliperochaoliveira@gmail.com')
  })

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return token
        case '@GoBarber:user':
          return JSON.stringify(user)
        default:
          return null
      }
    })

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    act(() => {
      result.current.signOut()
    })

    expect(removeItemSpy).toHaveBeenCalledTimes(2)
    expect(result.current.user).toBeUndefined()
  })

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    act(() => {
      result.current.updateUser(user)
    })

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    )

    expect(result.current.user).toEqual(user)
  })
})
