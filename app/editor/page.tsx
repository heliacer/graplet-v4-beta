'use client'

import { DockviewReact, DockviewReadyEvent, IDockviewPanelProps, themeDark } from "dockview-react"
// Needs granular cleaning
import './styles/bloat.css'
import { Folder, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"

const Default = (props: IDockviewPanelProps) => {
  return <div>{props.api.title}</div>
}

const components = {
  default: Default
}

export default function Editor() {
  function mount(event: DockviewReadyEvent) {
    // Testing
    event.api.addPanel({ id: crypto.randomUUID(), component: 'default' })
    event.api.addPanel({ id: crypto.randomUUID(), component: 'default' })
    event.api.addPanel({ id: crypto.randomUUID(), component: 'default' })
    const a = event.api.addPanel({ id: crypto.randomUUID(), component: 'default', position: { direction: 'right' } })
    event.api.addPanel({ id: crypto.randomUUID(), component: 'default' })
    const b = event.api.addPanel({ id: crypto.randomUUID(), component: 'default', position: { referencePanel: a, direction: 'below' } })
    event.api.addPanel({ id: crypto.randomUUID(), component: 'default', position: { referencePanel: b, direction: 'right' } })
  }

  return (
    <main className="h-screen flex flex-col">
      <nav className="h-10 flex gap-4 items-center">
        <p>Nav</p>
        <Link className='flex items-center gap-2' href='/mystuff'>
          <Folder size={18} />
          <p>My stuff</p>
        </Link>
        <button className="cursor-pointer flex items-center gap-2" onClick={() => signOut({ callbackUrl: '/' })}>
          <LogOut size={18} />
          <p>Sign Out</p>
        </button>
      </nav>
      <DockviewReact theme={themeDark} className="w-full h-full" onReady={mount} components={components} />
      <footer className="h-6 flex items-center">
        <p>Footer</p>
      </footer>
    </main>
  )
}