import { useEditorRefs } from '../../context/editor'
import { createProjectData } from '../../utils/createProjectData'
import { useEditorStore } from '../../state'
import { useKeybind } from '../../context/keybinds'
import { useEffect, useRef } from 'react'
import clsx from 'clsx'

export function SaveButton() {
  const { workspace, scene } = useEditorRefs()
  const selectedItems = useEditorStore(s => s.selectedItems)
  const objectVersions = useEditorStore(s => s.objectVersions)
  const hasChanges = useEditorStore(s => s.hasChanges)
  const setHasChanges = useEditorStore(s => s.setHasChanges)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    setHasChanges(true)
  }, [setHasChanges, objectVersions])

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
    setHasChanges(false)
  }

  useKeybind(
    {
      key: 's',
      modifiers: ['Ctrl']
    },
    e => {
      e.preventDefault()
      handleSave()
    }
  )

  return (
    <button
      onClick={handleSave}
      className={clsx(
        'text-sm flex items-center gap-1',
        hasChanges ? 'cursor-pointer' : 'text-ui-400'
      )}
      disabled={!hasChanges}
    >
      <p>Save now</p>
    </button>
  )
}
