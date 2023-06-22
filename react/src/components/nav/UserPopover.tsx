'use client'

import { Popover } from '@headlessui/react'
import React, { ReactNode } from 'react'

export const UserPopover = ({
  children,
  menu,
}: {
  children: ReactNode
  menu: ReactNode
}) => {
  return (
    <Popover className="h-full">
      {({ close }) => (
        <>
          <Popover.Button className="h-full appearance-none">
            {children}
          </Popover.Button>

          <Popover.Panel
            className="absolute z-10 right-3 mt-3"
            onMouseLeave={close}
          >
            {menu}
          </Popover.Panel>
        </>
      )}
    </Popover>
  )
}
