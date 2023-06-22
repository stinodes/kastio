import { cookies } from 'next/dist/client/components/headers'
import wretch, { ConfiguredMiddleware } from 'wretch'

const auth: ConfiguredMiddleware = next => (url, opts) => {
  let token
  if (global.localStorage) token = global.localStorage.getItem('auth_token')
  else {
    const t = cookies().get('token')
    token = t?.value && `Bearer ${t.value}`
    console.log('TOKEN', token)
  }

  if (!token) return next(url, opts)

  if (!opts.headers) opts.headers = {}
  opts.headers.Authorization = token
  return next(url, opts)
}

export const api = wretch(
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL,
)
  .middlewares([auth])
  .options({ credentials: 'include', mode: 'cors' })
