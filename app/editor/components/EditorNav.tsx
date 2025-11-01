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
import { useEditor } from '../lib/EditorContext'
import { serialization } from 'blockly'
import { useRef, useState } from 'react'
import { clsx } from 'clsx'
import { ProjectData, SScene } from '../lib/types'
import { WorkspaceSvg } from 'blockly'
import { useObjectActions } from '../lib/hooks/useObjectActions'
import { applyProps, serializeObject } from '../lib/utils/sobject3d'
import { Scene } from 'three'
import { exprGenerator } from '../lib/blockly/engine/generator'
import { execute } from '../lib/utils/blockly'

function createProjectData(workspace: WorkspaceSvg, scene: Scene): ProjectData {
  return {
    workspace: serialization.workspaces.save(workspace),
    scene: serializeObject(scene) as SScene
  }
}

export default function EditorNav() {
  const { data: session } = useSession()
  const {
    workspace,
    runState,
    isRunning,
    scene,
    varEnv,
    funcEnv,
    setIsRunning
  } = useEditor()
  const { loadProjectData, loadDefaultScene } = useObjectActions()
  const [isPaused, setIsPaused] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function togglePaused() {
    setIsPaused((prev) => {
      runState.current.shouldPause = !prev
      return !prev
    })
  }

  async function handleRun() {
    if (!workspace) return
    const expr = exprGenerator.workspaceToExpression(workspace)
    await execute(
      expr,
      {
        scene: scene.current,
        variables: varEnv.current,
        functions: funcEnv.current,
        runState: runState
      },
      setIsRunning
    )
  }

  function handleStop() {
    runState.current.shouldStop = true
    setIsPaused(false)
  }

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

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      alert('Please select a JSON file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      loadProjectData(event.target?.result as string)
      reader.readAsText(file)
      e.target.value = ''
    }
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
            <DropdownOption onClick={handleStartFresh}>
              <p>Load New</p>
            </DropdownOption>
          </DropdownContent>
        </DropdownMenu>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex gap-1">
          <button
            onClick={handleRun}
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
            <DropdownContent className="min-w-38">
              <DropdownOption asChild>
                <Link className="flex items-center gap-2" href="/mystuff">
                  <Folder size={14} />
                  <p>My Stuff</p>
                </Link>
              </DropdownOption>
              <DropdownSeparator />
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
                <Link className="flex items-center gap-2" href="/account">
                  <Settings2 size={14} />
                  <p>Account</p>
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
