'use client'

import Dockview from './components/dockview'
import EditorNav from './components/EditorNav'
import { EditorProvider } from './lib/EditorContext'
import { TriggerProvider } from './lib/TriggerContext'

export default function Editor() {
  return (
    <div className="h-screen flex flex-col">
      <TriggerProvider>
        <EditorProvider>
          <EditorNav />
          <Dockview />
          <footer className="h-6 flex items-center">
            <p>Footer</p>
          </footer>
        </EditorProvider>
      </TriggerProvider>
    </div>
  )
}
