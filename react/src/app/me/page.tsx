import { api } from '@/src/api'
import React from 'react'

const UserPage = async () => {
  const user = await api.url('/auth/me').get().json<{ username: string }>()
  if (!user) return null

  return (
    <div className="bg-red-500 dark:bg-slate-800 min-h-screen">
      <div className="px-8 py-8 flex min-h-full w-full justify-center items-center">
        <div className="rounded-md bg-white dark:bg-gray-900 p-8 flex-1 md:max-w-xl drop-shadow-xl">
          <div className="flex items-center">
            <div className="rounded-full bg-gray-500 drop-shadow-xl mr-8 w-16 h-16" />
            <p className="font-bold text-2xl">{user.username}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPage
