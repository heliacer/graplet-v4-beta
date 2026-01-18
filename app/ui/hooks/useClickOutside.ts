import { useEffect, useRef } from 'react'

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: () => void,
  listenToEscape = true
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    if (listenToEscape) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    function cleanup() {
      document.removeEventListener('mousedown', handleClickOutside)
      if (listenToEscape) {
        document.removeEventListener('keydown', handleEscapeKey)
      }
    }

    return cleanup
  }, [handler, listenToEscape])

  return ref
}
