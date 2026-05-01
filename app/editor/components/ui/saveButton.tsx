import { Save } from 'lucide-react'
import { useEditorRefs } from '../../context/editor'
import { createProjectData } from '../../utils/createProjectData'
import { useEditorStore } from '../../state'
import { useEffect } from 'react'
import { useKeybinds } from '../../context/keybinds'

export function SaveButton() {
  const { workspace, scene } = useEditorRefs()
  const selectedItems = useEditorStore(s => s.selectedItems)
  const { register, unregister } = useKeybinds()

  function handleSave() {
    if (!workspace.current) throw Error('Missing workspace')
    const projectData = createProjectData(
      workspace.current,
      scene.current,
      selectedItems
    )
    localStorage.setItem('projectData', JSON.stringify(projectData))
    console.info(
      '%cSaved project to localStorage:',
      'color: salmon;',
      projectData
    )
  }

  useEffect(() => {
    register(
      {
        key: 's',
        modifiers: ['Ctrl']
      },
      e => {
        e.preventDefault()
        handleSave()
      }
    )
    return () => unregister({ key: 's', modifiers: ['Ctrl'] })
  }, [])

  return (
    <button
      onClick={() => handleSave}
      className='text-sm flex items-center gap-1 cursor-pointer'
    >
      <Save size={14} />
      <p>Save now</p>
    </button>
  )
}
