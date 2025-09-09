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
  Folder,
  LogOut,
  Play,
  Settings2,
  User
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import Logo from '@/app/ui/logo'
import { useTrigger } from '../lib/TriggerContext'
import { useEditor } from '../lib/EditorContext'
import { serialization } from 'blockly'
import { useRef } from 'react'

export default function EditorNav() {
  const { data: session } = useSession()
  const emitter = useTrigger()
  const { workspace } = useEditor()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleSaveFile() {
    if (!workspace) throw Error('Missing workspace')
    const json = serialization.workspaces.save(workspace)
    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'blocks.json'
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
      try {
        const json = JSON.parse(event.target?.result as string)
        if (!workspace) throw Error('Missing workspace')
        serialization.workspaces.load(json, workspace)
      } catch (err) {
        console.error('Invalid JSON file', err)
        alert('Could not load JSON file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
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
            <DropdownOption onClick={handleSaveFile}>
              <p>Save to File ...</p>
            </DropdownOption>
            <DropdownOption onClick={handleUploadFile}>
              <p>Load from File ...</p>
            </DropdownOption>
          </DropdownContent>
        </DropdownMenu>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <button
          onClick={() => emitter.emit('runScene')}
          className="flex items-center gap-1 cursor-pointer rounded-lg px-1.5 bg-accent"
        >
          <Play size={16} />
          <p>Run</p>
        </button>
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
