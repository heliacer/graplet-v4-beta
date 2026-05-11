import { useRef } from 'react'
import { useEditorRefs } from '@/app/editor/context/editor'
import {
  File,
  FolderDown,
  FolderSync,
  FolderUp,
  Keyboard,
  Settings,
  Settings2
} from 'lucide-react'
import { serialization } from 'blockly'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { useSceneActions } from '@/app/editor/hooks/useSceneActions'
import { upsertPanel } from '@/app/editor/utils/dockview'
import { useEditorStore } from '@/app/editor/state'
import { createProjectData } from '@/app/editor/utils/createProjectData'
import { useKeybind } from '@/app/editor/context/keybinds'

export function FileMenu() {
  const { workspaceRef, sceneRef } = useEditorRefs()
  const dvApi = useEditorStore(s => s.dvApi)
  const selectedItems = useEditorStore(s => s.selectedItems)
  const { loadProjectData, loadDefaultScene } = useSceneActions()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleSaveFile() {
    if (!workspaceRef.current) throw Error('Missing workspace')
    const projectData = createProjectData(
      workspaceRef.current,
      sceneRef.current,
      selectedItems
    )
    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'project.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleUploadFile() {
    fileInputRef.current?.click()
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      alert('Please select a JSON file')
      return
    }

    const text = await file.text()
    loadProjectData(text)
    e.target.value = ''
  }

  function handleStartFresh() {
    if (!workspaceRef.current) throw Error('Missing workspace')
    const isConfirmed = confirm(
      'This will remove any existing progress. Are you sure?'
    )
    if (isConfirmed) {
      serialization.workspaces.load({}, workspaceRef.current)
      loadDefaultScene()
    }
  }

  const items: DropdownItemProps[] = [
    {
      label: 'Export',
      Icon: FolderDown,
      onClick: handleSaveFile
    },
    {
      label: 'Load from ...',
      Icon: FolderUp,
      onClick: handleUploadFile
    },
    {
      label: 'Load New',
      Icon: FolderSync,
      onClick: handleStartFresh
    },
    {
      label: 'Preferences',
      Icon: Settings2,
      children: [
        {
          label: 'Settings',
          Icon: Settings,
          onClick: () => upsertPanel(dvApi, 'settings', 'Settings', 'Settings')
        },
        {
          label: 'Keybinds',
          Icon: Keyboard,
          onClick: () => upsertPanel(dvApi, 'keybinds', 'Keybinds', 'Keyboard')
        }
      ]
    }
  ]

  useKeybind({ key: '/', modifiers: ['Ctrl'] }, () =>
    upsertPanel(dvApi, 'keybinds', 'Keybinds', 'Keyboard', true)
  )
  useKeybind({ key: 'i', modifiers: ['Ctrl'] }, () =>
    upsertPanel(dvApi, 'settings', 'Settings', 'Settings', true)
  )

  return (
    <>
      <Dropdown label='File' Icon={File} items={items} />
      <input
        id='fileInput'
        type='file'
        accept='.json,application/json'
        ref={fileInputRef}
        className='hidden'
        onChange={onFileChange}
      />
    </>
  )
}
