'use client'
import { useLayoutEffect } from 'react'
import { useEditorStore } from './state'
import { EditorHeader } from './components/Header'
import { EditorProvider } from './context/EditorContext'
import { GrapletDockview } from './components/Dockview'
import { ContextMenu } from './components/ui/ContextMenu'
import { Footer } from './components/ui/Footer'
import { Notifications } from './components/ui/Notifications'
import { KeybindProvider } from './context/KeybindsContext'
import { objectInitialState } from './state/slices/object'

export default function Editor() {
  useLayoutEffect(() => {
    return () => {
      /**
       * @todo (#34) Scene UX - actually use the cache
       * -> snapshots can be recycled
       * hold project id info, so that marked dirty if
       * not the same project.
       */
      useEditorStore.setState({ ...objectInitialState })
    }
  }, [])

  return (
    <main className='h-screen flex flex-col overflow-hidden'>
      <KeybindProvider>
        <EditorProvider>
          <EditorHeader />
          <GrapletDockview />
          <Footer />
          <Notifications />
          <ContextMenu />
        </EditorProvider>
      </KeybindProvider>
    </main>
  )
}
