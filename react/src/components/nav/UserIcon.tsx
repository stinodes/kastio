import { api } from '@/src/api'
import { useClassNames } from '@/src/hooks/useClassNames'
import React from 'react'

export const UserIcon = async () => {
  const cx = useClassNames([
    'flex items-center justify-center transition',
    'h-full px-8',
    'border-l border-gray-800',
    'dark:bg-gray-900',
    'dark:hover:bg-gray-800 dark:active:bg-slate-900',
  ])

  const user = await api
    .url('/auth/me')
    .get()
    .unauthorized(() => null)
    .json<null | { username: string }>()

  return (
    <div className={cx}>
      <span className="block w-12 h-12 rounded-full bg-red-300 mr-4" />
      <span className="font-bold">{user?.username}</span>
    </div>
  )
}
