import React, { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react'
import NextLink, { LinkProps } from 'next/link'
import { useClassNames } from '../hooks/useClassNames'

type ButtonStyleProps = {
  variant: 'primary' | 'secondary' | 'tertiary'
  className?: undefined | string
}

const useButtonClasses = ({
  variant,
  className,
  asLink,
}: ButtonStyleProps & { asLink?: boolean }) => {
  return useClassNames([
    'w-full rounded-md h-10 px-6 transition',
    variant === 'primary' && `bg-red-500 hover:bg-red-400 active:bg-red-600`,
    variant === 'secondary' &&
      `bg-gray-200 hover:bg-gray-100 active:bg-gray-300`,
    variant === 'secondary' &&
      `dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-900`,
    variant === 'primary' && `text-white`,
    asLink && 'flex justify-center items-center',
    className,
  ])
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>
>((props: ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>, ref) => {
  const cn = useButtonClasses(props)

  return <button {...props} ref={ref} className={cn} />
})
Button.displayName = 'Button'

export const Link = (
  props: ButtonStyleProps & LinkProps & { children: ReactNode },
) => {
  const cn = useButtonClasses({
    variant: props.variant,
    className: props.className,
    asLink: true,
  })

  return <NextLink {...props} className={cn} />
}
Link.displayName = 'Link'
