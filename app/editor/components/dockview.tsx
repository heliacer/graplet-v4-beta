'use client'

import '../styles/dvtheme.css' 
import { DockviewReact, DockviewReadyEvent } from 'dockview-react'
import { RightControls } from './ui/controls/tabControls'
import { TabHeader } from './ui/tabHeader'
import DebugPanel from './panels/DebugPanel'
import ScenePanel from './panels/ScenePanel'
import ExplorerPanel from './panels/ExplorerPanel'
import CodePanel from './panels/CodePanel'
import PropertiesPanel from './panels/PropertiesPanel'
import SettingsPanel from './panels/SettingsPanel'
import KeybindsPanel from './panels/KeybindsPanel'
import { useEffect } from 'react'
import { useEditorStore } from '../state'
import { dvLayout } from './dvLayout'

const panelComponents = {
  debug: DebugPanel,
  code: CodePanel,
  scene: ScenePanel,
  explorer: ExplorerPanel,
  properties: PropertiesPanel,
  settings: SettingsPanel,
  keybinds: KeybindsPanel
}

export function GrapletDockview() {
  const dvApi = useEditorStore(s => s.dvApi)
  const setDvApi = useEditorStore(s => s.setDvApi)

  function mount(event: DockviewReadyEvent) {
    const { api } = event
    const data = localStorage.getItem('dvLayout')

    if (data) {
      try {
        const layout = JSON.parse(data)
        api.fromJSON(layout)
        console.info('%cLoaded dockview layout:', 'color: salmon;', layout)
      } catch (error) {
        console.error('Could not parse JSON data', error)
      }
    } else {
      api.fromJSON(dvLayout)
    }
    setDvApi(api)
  }

  useEffect(() => {
    if (!dvApi) return

    const layoutListener = () => {
      const layout = dvApi.toJSON()
      localStorage.setItem('dvLayout', JSON.stringify(layout))
    }

    dvApi.onDidLayoutChange(layoutListener)
  }, [dvApi])

  return (
    <DockviewReact
      theme={{
        name: 'graplet',
        className: 'dv-theme',
      }}
      className='w-full h-full'
      onReady={mount}
      components={panelComponents}
      defaultTabComponent={TabHeader}
      rightHeaderActionsComponent={RightControls}
    />
  )
}
