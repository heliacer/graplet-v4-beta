'use client'
import { useEffect } from 'react'
import { useEditorStore } from './state'
import { EditorHeader } from './components/Header'
import { EditorProvider } from './context'
import { GrapletDockview } from './components/dockview'
import { ContextMenu } from './components/ui/contextMenu'
import { Footer } from './components/ui/footer'
import { Notifications } from './components/ui/notifications'

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
