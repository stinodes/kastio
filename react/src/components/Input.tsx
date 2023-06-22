import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'
import { useClassNames } from '../hooks/useClassNames'

type InputProps = { label?: string } & InputHTMLAttributes<HTMLInputElement>

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }: InputProps, ref) => {
    const className = useClassNames([
      'rounded-md px-4 w-full transition',
      'border-2 border-gray-200',
      'dark:border-gray-600 dark:bg-gray-800 dark:text-white',
      'dark:hover:border-gray-500',
      'focus:border-red-500 hover:focus:border-red-500 focus:ring focus:ring-4 focus:ring-red-500 focus:ring-opacity-25',
      'text-black',
      props.className,
    ])

    return (
      <label className="mb-4">
        {label && <span className="block mb-1 font-bold">{label}</span>}
        <input
          type="text"
          {...props}
          ref={ref}
          className={className}
          placeholder={props.placeholder || label}
        />
      </label>
    )
  },
)
TextInput.displayName = 'TextInput'

export const InputError = ({ children }: { children: ReactNode }) => {
  if (!children) return null
  return (
    <p role="alert" className="text-red-500 text-sm -mt-2 mb-4">
      {children}
    </p>
  )
}
