import {
  DropdownMenu,
  DropdownButton,
  DropdownContent,
  DropdownOption,
  DropdownSeparator
} from '@/app/ui/components/Dropdown'
import {
  ChevronDown,
  File,
  Flag,
  Folder,
  LogOut,
  Octagon,
  Pause,
  Play,
  Settings2,
  StepForward,
  User
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import Logo from '@/app/ui/logo'
import { useTrigger } from '../lib/TriggerContext'
import { useEditor } from '../lib/EditorContext'
import { serialization } from 'blockly'
import { useRef, useState } from 'react'
import { clsx } from 'clsx'
import { ProjectData } from '../lib/types'
import { WorkspaceSvg } from 'blockly'
import { ObjectsEnv } from '../lib/blockly/engine/ast'
import { useObjectActions } from '../lib/hooks/useObjectActions'
import { objectRegistry } from '../lib/blockly/blocks'

function createProjectData(
  workspace: WorkspaceSvg,
  objects: ObjectsEnv
): ProjectData {
  return {
    workspace: serialization.workspaces.save(workspace),
    scene: {
      objects: Array.from(objects).map(([name, obj]) => ({
        name,
        position: obj.position.toArray() as [number, number, number],
        rotation: obj.rotation.toArray().slice(0, 3) as [
          number,
          number,
          number
        ],
        scale: obj.scale.toArray() as [number, number, number]
      }))
    }
  }
}

export default function EditorNav() {
  const { data: session } = useSession()
  const emitter = useTrigger()
  const {
    workspace,
    runState,
    isRunning,
    objects,
    scene,
    setObjectNames,
    setCurrentObject
  } = useEditor()
  const { createObject } = useObjectActions()
  const [isPaused, setIsPaused] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function togglePaused() {
    setIsPaused((prev) => {
      const newVal = !prev
      runState.current.shouldPause = newVal
      return newVal
    })
  }

  function handleStop() {
    runState.current.shouldStop = true
    setIsPaused(false)
  }

  function handleSave() {
    if (!workspace) throw Error('Missing workspace')
    const projectData = createProjectData(workspace, objects.current)
    localStorage.setItem('projectData', JSON.stringify(projectData))
    console.log('Saved project to localStorage', projectData)
  }

  function handleSaveFile() {
    if (!workspace) throw Error('Missing workspace')
    const projectData = createProjectData(workspace, objects.current)
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

  /**
   * @todo needs heavy refactoring (same methods used in scene panel)
   */
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      alert('Please select a JSON file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        if (!workspace) throw Error('Missing workspace')

        const projectData = JSON.parse(
          event.target?.result as string
        ) as ProjectData

        // clear scene
        requestAnimationFrame(() => {
          scene.current.remove(scene.current.children[0])
        })
        objects.current = new Map()
        setObjectNames([])
        setCurrentObject('')
        objectRegistry.options = []

        // load scene
        if (projectData.scene) {
          for (const object of projectData.scene.objects) {
            createObject(object)
          }
          console.log('Loaded scene state: ', projectData.scene)
        } else {
          createObject()
          console.log('Starting with an empty scene.')
        }

        // load workspace
        serialization.workspaces.load(projectData.workspace, workspace)
        console.log('Loaded workspace state: ', projectData.workspace)
      } catch (err) {
        console.error('Invalid JSON file', err)
        alert('Could not load JSON file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleLoadEmpty() {
    if (!workspace) throw Error('Missing workspace')
    const isConfirmed = confirm(
      'This will remove any existing progress. Are you sure?'
    )
    if (isConfirmed) {
      serialization.workspaces.load({}, workspace)
      requestAnimationFrame(() => {
        scene.current.remove(scene.current.children[0])
      })
      objects.current = new Map()
      setObjectNames([])
      setCurrentObject('')
      objectRegistry.options = []
    }
  }

  return (
    <nav className="h-11 flex items-center justify-between px-2">
      <div className="w-full h-full flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={20} />
          <p className="text-lg">Graplet</p>
        </Link>
        <DropdownMenu>
          <DropdownButton>
            <File size={14} />
            <p>File</p>
          </DropdownButton>
          <DropdownContent align="left" className="min-w-36">
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
            <DropdownOption onClick={handleLoadEmpty}>
              <p>Load empty</p>
            </DropdownOption>
          </DropdownContent>
        </DropdownMenu>
        <button
          onClick={() => {
            workspace?.getFlyout()?.setVisible(false)
          }}
        >
          <p>toggle toolbox</p>
        </button>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex gap-1">
          <button
            onClick={() => emitter.emit('runScene')}
            title="run"
            className={clsx(
              'p-1 rounded',
              isRunning ? 'bg-zinc-700' : 'cursor-pointer bg-teal-600'
            )}
            disabled={isRunning}
          >
            <Flag size={16} />
          </button>
          <button
            onClick={togglePaused}
            title={isPaused ? 'resume' : 'pause'}
            className={clsx(
              'p-1 rounded',
              isRunning
                ? isPaused
                  ? 'cursor-pointer bg-teal-600'
                  : 'cursor-pointer bg-orange-400'
                : 'bg-zinc-700'
            )}
            disabled={!isRunning}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            onClick={handleStop}
            title="stop"
            className={clsx(
              'p-1 rounded',
              isRunning ? 'cursor-pointer bg-rose-500' : 'bg-zinc-700'
            )}
          >
            <Octagon size={16} />
          </button>
          <button
            onClick={() => (runState.current.shouldStep = true)}
            className={clsx(
              'p-1 rounded',
              isRunning && isPaused
                ? 'cursor-pointer bg-sky-600'
                : 'bg-zinc-700'
            )}
            title="step"
          >
            <StepForward size={16} />
          </button>
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-end">
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownButton>
              <User size={16} />
              <p>{session?.user?.name}</p>
              <ChevronDown size={16} />
            </DropdownButton>
            <DropdownContent className="min-w-44">
              <DropdownOption asChild>
                <Link
                  className="flex items-center gap-2"
                  href={`/users/${session?.user?.id}`}
                >
                  <User size={14} />
                  <p>Profile</p>
                </Link>
              </DropdownOption>
              <DropdownOption asChild>
                <Link className="flex items-center gap-2" href="/mystuff">
                  <Folder size={14} />
                  <p>My Stuff</p>
                </Link>
              </DropdownOption>
              <DropdownOption asChild>
                <Link className="flex items-center gap-2" href="/account">
                  <Settings2 size={14} />
                  <p>Account Settings</p>
                </Link>
              </DropdownOption>
              <DropdownSeparator />
              <DropdownOption onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut size={14} />
                <p>Sign Out</p>
              </DropdownOption>
            </DropdownContent>
          </DropdownMenu>
          <input
            type="file"
            accept=".json,application/json"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileChange}
          />
        </div>
      </div>
    </nav>
  )
}
