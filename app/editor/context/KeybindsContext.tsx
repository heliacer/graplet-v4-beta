import React, {
  createContext,
  RefObject,
  useContext,
  useEffect,
  useRef
} from 'react'

interface Keybind {
  key?: string // character intent, e.g. 'z', 'y'
  code?: string // physical key, e.g. 'Numpad0', 'ArrowUp'
  modifiers?: string[]
}

type KeybindHandler = (e: KeyboardEvent) => void
type KeybindRegistry = Map<string, KeybindHandler>

interface KeybindsContextType {
  keybinds: RefObject<KeybindRegistry>
  register: (shortcut: Keybind, handler: KeybindHandler) => void
  unregister: (shortcut: Keybind) => void
}

const KeybindsContext = createContext<KeybindsContextType>({
  keybinds: null!,
  register: () => {},
  unregister: () => {}
})

/** 
 * @todo (#36) Keybinds
 * -> bulk registration method!
 */
export function useKeybind(keybind: Keybind, fn: (e: KeyboardEvent) => void) {
  const { register, unregister } = useContext(KeybindsContext)
  const callback = useRef(fn)

  useEffect(() => {
    callback.current = fn
  }, [fn])

  useEffect(() => {
    register(keybind, e => callback.current(e))
    return () => unregister(keybind)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

function normalizeKeybind(keybind: Keybind): string {
  const mods = keybind.modifiers?.slice().sort() || []
  const id = keybind.code ?? keybind.key!
  return [...mods, id].join('+')
}

export function KeybindProvider({ children }: { children: React.ReactNode }) {
  const keybinds = useRef<KeybindRegistry>(new Map())

  function register(
    keybind: Keybind,
    handler: KeybindHandler,
    override = false
  ) {
    const normalizedKey = normalizeKeybind(keybind)
    if (keybinds.current.has(normalizedKey) && !override) {
      throw Error(`${normalizedKey} is already being used`)
    }
    keybinds.current.set(normalizedKey, handler)
  }

  function unregister(keybind: Keybind) {
    const normalizedKey = normalizeKeybind(keybind)
    keybinds.current.delete(normalizedKey)
  }

  function handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return
    }

    const modifiers: string[] = []
    if (event.ctrlKey) modifiers.push('Ctrl')
    if (event.altKey) modifiers.push('Alt')
    if (event.shiftKey) modifiers.push('Shift')
    if (event.metaKey) modifiers.push('Meta')

    const byCode = [...modifiers.sort(), event.code].join('+')
    const byKey = [...modifiers.sort(), event.key].join('+')

    const handler = keybinds.current.get(byCode) ?? keybinds.current.get(byKey)
    if (handler) {
      event.preventDefault()
      handler(event)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <KeybindsContext.Provider value={{ keybinds, register, unregister }}>
      {children}
    </KeybindsContext.Provider>
  )
}
