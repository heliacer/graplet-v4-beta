import { useEditorRefs } from '@/app/editor/lib/context'
import { serializeObject } from '@/app/editor/lib/utils/sobject'
import { ProjectData, SScene } from '@/app/editor/lib/types'
import {
  File,
  FolderDown,
  FolderSync,
  FolderUp,
  Keyboard,
  Save,
  Settings,
  Settings2
} from 'lucide-react'
import { useRef } from 'react'
import { serialization, WorkspaceSvg } from 'blockly'
import { Scene } from 'three'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { useSceneActions } from '@/app/editor/lib/hooks/useSceneActions'
import { upsertPanel } from '@/app/editor/lib/utils/dockview'
import { useEditorStore } from '@/app/editor/lib/state'

function createProjectData(
  workspace: WorkspaceSvg,
  scene: Scene,
  selectedItems: string[]
): ProjectData {
  return {
    workspace: serialization.workspaces.save(workspace),
    scene: serializeObject(scene, true) as SScene,
    selectedItems
  }
}

export function FileMenu() {
  const { workspace, scene } = useEditorRefs()
  const dvApi = useEditorStore(s => s.dvApi)
  const selectedItems = useEditorStore(s => s.selectedItems)
  const { loadProjectData, loadDefaultScene } = useSceneActions()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

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

  function handleSaveFile() {
    if (!workspace.current) throw Error('Missing workspace')
    const projectData = createProjectData(
      workspace.current,
      scene.current,
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
    if (!workspace.current) throw Error('Missing workspace')
    const isConfirmed = confirm(
      'This will remove any existing progress. Are you sure?'
    )
    if (isConfirmed) {
      serialization.workspaces.load({}, workspace.current)
      loadDefaultScene()
    }
  }

  const items: DropdownItemProps[] = [
    {
      label: 'Save Now',
      Icon: Save,
      onClick: handleSave
    },
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
