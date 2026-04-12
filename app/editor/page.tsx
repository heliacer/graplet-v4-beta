'use client'
import { useEffect } from 'react'
import { EditorHeader } from './components/Header'
import { GrapletDockview } from './components/dockview'
import { ContextMenu } from './components/ui/contextMenu'
import { Footer } from './components/ui/footer'
import { Notifications } from './components/ui/notifications'
import { EditorProvider } from './lib/context'
import { useEditorStore } from './lib/state'

export default function Editor() {
  useEffect(() => {
    useEditorStore.setState({
      selectedItems: []
    })
  }, [])

  return (
    <div className='h-screen flex flex-col'>
      <EditorProvider>
        <EditorHeader />
        <GrapletDockview />
        <Footer />
        <Notifications />
        <ContextMenu />
      </EditorProvider>
    </div>
  )
}
