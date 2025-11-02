'use client'

import GrapletDockview from './components/Dockview'
import EditorHeader from './components/Header'
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
      </EditorProvider>
    </div>
  )
}
