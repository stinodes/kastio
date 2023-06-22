import { useMemo } from 'react'

type ClassNames = (false | null | undefined | string)[]

export const useClassNames = (cx: ClassNames) => {
  return useMemo(() => {
    return cx.filter(Boolean).join(' ')
  }, cx)
}
