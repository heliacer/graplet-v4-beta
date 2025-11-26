'use client'

import GrapletDockview from './components/dockview'
import EditorHeader from './components/Header'
import { ContextMenu } from './components/ui/contextMenu'
import { EditorProvider } from './lib/EditorContext'

export default function Editor() {
  return (
    <div className="h-screen flex flex-col">
      <EditorProvider>
        <EditorHeader />
        <GrapletDockview />
        <footer className="h-6 flex items-center">
          <p>Footer</p>
        </footer>
        <ContextMenu/>
      </EditorProvider>
    </div>
  )
}
