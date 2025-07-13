import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(key: string, defaultValue: T | (() => T)) {
  const getInitial = () => {
    if (typeof window === 'undefined') return defaultValue instanceof Function ? defaultValue() : defaultValue

    const item = localStorage.getItem(key)
    if (item) return JSON.parse(item)

    return defaultValue instanceof Function ? defaultValue() : defaultValue
  }

  const [value, setValue] = useState<T>(getInitial)

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  const remove = useCallback(() => {
    localStorage.removeItem(key)
    setValue(undefined as unknown as T)
  }, [])

  return [value, setValue, remove] as const
}
