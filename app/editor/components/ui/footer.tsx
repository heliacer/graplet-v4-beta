import { useEffect } from "react"
import { useEditor } from "../../lib/EditorContext"
import { upsertPanel } from "../../lib/utils/dockview"

export function Footer() {
  const { dvApi } = useEditor()

  useEffect(() => {
    if (!dvApi) return
    
    const handleKeybinds = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        upsertPanel(dvApi, 'keybinds', 'Keybinds', 'Keyboard')
      }
    }

    document.addEventListener('keydown', handleKeybinds)

    return () => {
      document.removeEventListener('keydown', handleKeybinds)
    }
  }, [dvApi])



  return (
    <footer className='h-6 flex items-center'>
      <p>Footer</p>
    </footer>
  )
}