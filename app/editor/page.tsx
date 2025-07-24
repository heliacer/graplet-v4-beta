'use client'

import { DockviewReact, DockviewReadyEvent, IDockviewPanelProps, DockviewTheme, DockviewDefaultTab, IDockviewPanelHeaderProps } from "dockview-react"
// Needs granular cleaning
import './styles/bloat.css'
import { Folder, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { usePanelState } from "./hooks/usePanelState"

const components = {
  default: DefaultPanel
}

const grapletTheme: DockviewTheme = {
  name: 'graplet',
  className: 'dockview-graplet'
}

function DefaultPanel(props: IDockviewPanelProps) {
  const { isActive, title, width, height } = usePanelState(props.api)
  return (
    <div className="m-4">
      <p className="italic">Prototype</p>
      <p>ID: {props.api.id}</p>
      <p>Title: {title}</p>
      <p>IsActive: {isActive ? 'true' : 'false'}</p>
      <p>Width: {Math.round(width)} Height: {Math.round(height)}</p>
    </div>
  )
}

function DefaultTab(props: IDockviewPanelHeaderProps) {
  return <DockviewDefaultTab hideClose {...props} />
}

export default function Editor() {
  function mount(event: DockviewReadyEvent) {
    // Testing
    event.api.addPanel({
      id: crypto.randomUUID(),
      title: 'Code',
      component: 'default',
    })

    event.api.addPanel({
      id: crypto.randomUUID(),
      title: 'Model',
      component: 'default'
    })

    event.api.addPanel({
      id: crypto.randomUUID(),
      title: 'Addons',
      component: 'default'
    })

    const scenePanel = event.api.addPanel({
      id: crypto.randomUUID(),
      component: 'default',
      title: 'Scene',
      position: { direction: 'right' }
    })

    event.api.addPanel({
      id: crypto.randomUUID(),
      title: 'Console',
      component: 'default',
    })

    const propertiesPanel = event.api.addPanel({
      id: crypto.randomUUID(),
      title: 'Properties',
      component: 'default',
      position: { referencePanel: scenePanel, direction: 'below' }
    })

    event.api.addPanel({
      id: crypto.randomUUID(), component: 'default',
      title: 'Assets',
      position: { referencePanel: propertiesPanel, direction: 'right' }
    })
  }

  return (
    <div className="h-screen flex flex-col">
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
      <DockviewReact
        defaultTabComponent={DefaultTab}
        theme={grapletTheme}
        className="w-full h-full"
        onReady={mount}
        components={components}
        disableFloatingGroups
      />
      <footer className="h-6 flex items-center">
        <p>Footer</p>
      </footer>
    </div>
  )
}