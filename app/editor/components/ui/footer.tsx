import { useEffect } from 'react'
import { useEditor } from '../../lib/EditorContext'

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

/* 
function chordToDisplay(chord: string) {
  // used for later, in the keybind tab when it get's the keybind map (with the keybind chord -> binded to the command action)
}
 */

export function Footer() {
  const { dvApi } = useEditor()

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
      // const display = chordToDisplay(chord)
      console.log('action with', chord)
    }

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [dvApi])

  return (
    <footer className='h-6 flex items-center'>
      <p>Footer</p>
    </footer>
  )
}
