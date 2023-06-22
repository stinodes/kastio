import { ReactNode } from 'react'

const LoginLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-red-500 dark:bg-slate-800 min-h-screen">
      <div className="px-8 py-8 flex min-h-full w-full justify-center items-center">
        <div className="rounded-md bg-white dark:bg-gray-900 p-8 flex-1 md:max-w-xl drop-shadow-xl">
          {children}
        </div>
      </div>
    </div>
  )
}

export default LoginLayout
