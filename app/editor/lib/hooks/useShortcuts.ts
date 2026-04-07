import { useEffect } from 'react'
import { useEditorStore } from '../state'

/**
 * @todo display (e.g / instead of Shift+Key7 and a instead of Keya )
 */
function chordToDisplay(chord: string) {
  return chord + '(not implemented)'
}

const modifiers = [
  'ShiftLeft',
  'ShiftRight',
  'ControlLeft',
  'ControlRight',
  'AltLeft',
  'AltRight',
  'MetaLeft',
  'MetaRight'
]

export function useShortcuts() {
  const dvApi = useEditorStore(s => s.dvApi)

  useEffect(() => {
    if (!dvApi) return

    const handleKeydown = (e: KeyboardEvent) => {
      if (modifiers.includes(e.code)) return

      const parts: string[] = []
      if (e.ctrlKey) {
        parts.push('ctrl')
      }
      if (e.shiftKey) {
        parts.push('shift')
      }
      if (e.altKey) {
        parts.push('alt')
      }
      parts.push(e.code)
      const chord = parts.join('+')
      const display = chordToDisplay(chord)
      console.log('chord as display: ', display)
      console.log('action with', chord)
    }

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [dvApi])
}
