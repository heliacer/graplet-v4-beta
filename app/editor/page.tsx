'use client'
import { EditorHeader } from './components/Header'
import { GrapletDockview } from './components/dockview'
import { ContextMenu } from './components/ui/contextMenu'
import { Notifications } from './components/ui/notifications'
import { EditorProvider } from './lib/EditorContext'

export default function Editor() {
  return (
    <div className='h-screen flex flex-col'>
      <EditorProvider>
        <EditorHeader />
        <GrapletDockview />
        <footer className='h-6 flex items-center'>
          <p>Footer</p>
        </footer>
        <Notifications />
        <ContextMenu />
      </EditorProvider>
    </div>
  )
}
