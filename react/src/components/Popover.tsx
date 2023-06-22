'use client'
import { Popover as PO } from '@headlessui/react'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  button: ReactNode
}

export const Popover = (props: Props) => (
  <PO>
    <PO.Button children={props.button} />
    <PO.Panel children={props.children} />
  </PO>
)
