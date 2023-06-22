import { api } from '@/src/api'
import React from 'react'

export const UserMenu = async () => {
  const user = await api
    .url('/auth/me')
    .get()
    .unauthorized(() => null)
    .json<null | { username: string }>()

  return (
    <div className="bg-gray-900 drop-shadow-xl rounded-md p-4 w-64">
      {user ? <p>welcome</p> : <p> not logged in</p>}
    </div>
  )
}
