'use server'

import { api } from '@/src/api'
import { cookies } from 'next/dist/client/components/headers'
import { redirect } from 'next/navigation'

export type LoginBody = {
  username: string
  password: string
}
export const login = async (body: LoginBody) => {
  const { success, token } = await api
    .url('/auth/login')
    .post(body)
    .unauthorized(() => ({ success: false, token: null }))
    .json<{ success: boolean; token: string }>()

  if (!success) return null

  cookies().set('token', token)
  return redirect('/me')
}

export type RegisterBody = {
  username: string
  email: string
  password: string
}
export const register = async (body: RegisterBody) => {
  await api
    .url('/auth/register')
    .post(body)
    .json<{ success: boolean; token: string }>()
    .catch()

  return redirect('/login')
}
