import React from 'react'
import { Logo } from './Logo'
import { UserIcon } from './UserIcon'
import { UserPopover } from './UserPopover'
import { UserMenu } from './UserMenu'

export const Nav = () => {
  return (
    <div className="w-screen h-20 drop-shadow-xl dark:bg-gray-900 flex items-center justify-between">
      <Logo />
      <UserPopover menu={<UserMenu />}>
        <UserIcon />
      </UserPopover>
    </div>
  )
}
