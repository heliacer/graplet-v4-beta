'use client'
import { useEffect } from 'react'
import { useEditorStore } from './state'
import { EditorHeader } from './components/Header'
import { EditorProvider } from './context/editor'
import { GrapletDockview } from './components/dockview'
import { ContextMenu } from './components/ui/contextMenu'
import { Footer } from './components/ui/footer'
import { Notifications } from './components/ui/notifications'
import { KeybindProvider } from './context/keybinds'

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
