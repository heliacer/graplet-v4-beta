'use client'

import { DockviewReact, DockviewReadyEvent } from 'dockview-react'
import '../styles/base.css'
import '../styles/dvtheme.css'
import { Airplay, Folder, PenTool, Puzzle, Wrench } from 'lucide-react'
import { LeftControls, RightControls } from './controls'
import TabHeader from './tabHeader'

// Panels
import DebugPanel from './panels/DebugPanel'
import ScenePanel from './panels/ScenePanel'
// import AssetsPanel from './panels/AssetsPanel'
import ExplorerPanel from './panels/ExplorerPanel'
import ModelPanel from './panels/model/Panel'
import CodePanel from './panels/CodePanel'
import PropertiesPanel from './panels/PropertiesPanel'

const panelComponents = {
  debug: DebugPanel,
  code: CodePanel,
  scene: ScenePanel,
  explorer: ExplorerPanel,
  model: ModelPanel,
  properties: PropertiesPanel
}

export default function Dockview() {
  function mount(event: DockviewReadyEvent) {
    const { api } = event
    const codePanel = api.addPanel({
      id: 'scene',
      title: 'Scene',
      component: 'scene',
      initialWidth: 10,
      params: {
        Icon: <Airplay size={16} />
      }
    })

    api.addPanel({
      id: 'model',
      title: 'Model (Deprecated)',
      component: 'model',
      params: {
        Icon: <PenTool size={16} />
      }
    })

    const explorerPanel = api.addPanel({
      id: 'explorer',
      component: 'explorer',
      title: 'Explorer',
      initialWidth: 1250,
      params: {
        Icon: <Folder size={16} />
      },
      position: { direction: 'right' }
    })

    api.addPanel({
      id: 'properties',
      title: 'Properties',
      component: 'properties',
      params: {
        Icon: <Wrench size={16} />
      },
      position: { referencePanel: explorerPanel, direction: 'below' }
    })

    codePanel.focus()

    api.addPanel({
      id: 'code',
      initialWidth: 1000, // not working
      title: 'Code',
      component: 'code',
      params: {
        Icon: <Puzzle size={16} />
      },
      position: { referencePanel: codePanel, direction: 'left' }
    })
  }

  return (
    <DockviewReact
      theme={{
        name: 'graplet',
        className: 'theme-graplet'
      }}
      className="w-full h-full overflow-hidden"
      onReady={mount}
      components={panelComponents}
      defaultTabComponent={TabHeader}
      leftHeaderActionsComponent={LeftControls}
      rightHeaderActionsComponent={RightControls}
    />
  )
}
