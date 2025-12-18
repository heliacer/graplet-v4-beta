import {
  DropdownMenu,
  DropdownButton,
  DropdownContent,
  DropdownOption,
  DropdownSeparator
} from '@/app/ui/components/Dropdown'

import { File } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/app/ui/logo'
import { serialization } from 'blockly'
import { useRef } from 'react'
import { WorkspaceSvg } from 'blockly'
import { Scene } from 'three'
import { ProjectData, SScene } from '../../lib/types'
import { serializeObject } from '../../lib/utils/sobject3d'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import { useEditor } from '../../lib/EditorContext'

function createProjectData(workspace: WorkspaceSvg, scene: Scene): ProjectData {
  return {
    workspace: serialization.workspaces.save(workspace),
    scene: serializeObject(scene) as SScene
  }
}

export default function NavMenu() {
  const { workspace, scene } = useEditor()
  const { loadProjectData, loadDefaultScene } = useObjectActions()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleSave() {
    if (!workspace) throw Error('Missing workspace')
    const projectData = createProjectData(workspace, scene.current)
    localStorage.setItem('projectData', JSON.stringify(projectData))
    console.info('Saved project to localStorage', projectData)
  }

  function handleSaveFile() {
    if (!workspace) throw Error('Missing workspace')
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

  /** @todo @refactor more as soon as more menus get added */
  return (
    <nav className='w-full h-full flex items-center gap-4'>
      <Link href='/' className='flex items-center gap-2'>
        <Logo size={20} />
        <p className='text-lg'>Graplet</p>
      </Link>
      <DropdownMenu>
        <DropdownButton>
          <File size={14} />
          <p>File</p>
        </DropdownButton>
        <DropdownContent align='left' className='min-w-36'>
          <DropdownOption onClick={handleSave}>
            <p>Save now</p>
          </DropdownOption>
          <DropdownSeparator />
          <DropdownOption onClick={handleSaveFile}>
            <p>Export</p>
          </DropdownOption>
          <DropdownSeparator />
          <DropdownOption onClick={handleUploadFile}>
            <p>Load from ...</p>
          </DropdownOption>
          <DropdownOption onClick={handleStartFresh}>
            <p>Load New</p>
          </DropdownOption>
        </DropdownContent>
      </DropdownMenu>
      <input
        type='file'
        accept='.json,application/json'
        ref={fileInputRef}
        className='hidden'
        onChange={onFileChange}
      />
    </nav>
  )
}
