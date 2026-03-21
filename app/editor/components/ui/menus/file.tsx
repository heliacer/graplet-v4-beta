import { useEditor } from '@/app/editor/lib/EditorContext'
import { serializeObject } from '@/app/editor/lib/utils/sobject'
import { ProjectData, SScene } from '@/app/editor/lib/types'
import {
  File,
  FolderDown,
  FolderSync,
  FolderUp,
  Save,
  Settings2
} from 'lucide-react'
import { useRef } from 'react'
import { serialization, WorkspaceSvg } from 'blockly'
import { Scene } from 'three'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { useSceneActions } from '@/app/editor/lib/hooks/useSceneActions'
import { upsertPanel } from '@/app/editor/lib/utils/dockview'

function createProjectData(workspace: WorkspaceSvg, scene: Scene): ProjectData {
  return {
    workspace: serialization.workspaces.save(workspace),
    scene: serializeObject(scene, true) as SScene
  }
}

export function FileMenu() {
  const { workspace, scene, dvApi } = useEditor()
  const { loadProjectData, loadDefaultScene } = useSceneActions()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleSave() {
    if (!workspace) throw Error('Missing workspace')
    /** @todo Consider using object registry and pass that as ProjectData, skipping internal objects (1) */
    const projectData = createProjectData(workspace, scene.current)
    localStorage.setItem('projectData', JSON.stringify(projectData))
    console.info(
      '%cSaved project to localStorage:',
      'color: salmon;',
      projectData
    )
  }

  function handleSaveFile() {
    if (!workspace) throw Error('Missing workspace')
    /** @todo Consider using object registry and pass that as ProjectData, skipping internal objects (2) */
    const projectData = createProjectData(workspace, scene.current)
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
    if (!workspace) throw Error('Missing workspace')
    const isConfirmed = confirm(
      'This will remove any existing progress. Are you sure?'
    )
    if (isConfirmed) {
      serialization.workspaces.load({}, workspace)
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
      label: 'Settings ...',
      Icon: Settings2,
      onClick: () => upsertPanel(dvApi, 'settings', 'Settings', 'Settings2')
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
