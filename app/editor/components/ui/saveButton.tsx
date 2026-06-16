import { useEditorRefs } from '../../context/EditorContext'
import { createProjectData } from '../../utils/createProjectData'
import { useEditorStore } from '../../state'
import { useKeybind } from '../../context/KeybindsContext'
import { useEffect, useRef } from 'react'
import clsx from 'clsx'

export function SaveButton() {
  const { workspaceRef } = useEditorRefs()
  const selectedItems = useEditorStore(s => s.selectedItems)
  const objectVersions = useEditorStore(s => s.objectVersions)
  const hasProjectChanges = useEditorStore(s => s.hasProjectChanges)
  const objectSnapshots = useEditorStore(s => s.objectSnapshots)
  const setHasProjectChanges = useEditorStore(s => s.setHasProjectChanges)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    setHasProjectChanges(true)
  }, [setHasProjectChanges, objectVersions])

  function handleSave() {
    if (!workspaceRef.current) throw Error('Missing workspace')
    const projectData = createProjectData(
      workspaceRef.current,
      objectSnapshots,
      selectedItems
    )
    localStorage.setItem('projectData', JSON.stringify(projectData))
    console.info(
      '%cSaved project to localStorage:',
      'color: salmon;',
      projectData
    )
    setHasProjectChanges(false)
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
        hasProjectChanges ? 'cursor-pointer' : 'text-ui-400'
      )}
      disabled={!hasProjectChanges}
    >
      <p>Save now</p>
    </button>
  )
}
