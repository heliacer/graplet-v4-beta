'use client'
import { useEffect } from 'react'
import { useEditorStore } from './state'
import { EditorHeader } from './components/Header'
import { EditorProvider } from './context/EditorContext'
import { GrapletDockview } from './components/Dockview'
import { ContextMenu } from './components/ui/ContextMenu'
import { Footer } from './components/ui/Footer'
import { Notifications } from './components/ui/Notifications'
import { KeybindProvider } from './context/KeybindsContext'

export default function Editor() {
  useEffect(() => {
    useEditorStore.setState({
      selectedItems: []
    })
  }, [])

  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <KeybindProvider>
        <EditorProvider>
          <EditorHeader />
          <GrapletDockview />
          <Footer />
          <Notifications />
          <ContextMenu />
        </EditorProvider>
      </KeybindProvider>
    </div>
  )
}
