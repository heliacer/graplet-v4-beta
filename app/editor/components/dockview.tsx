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
  // assets: AssetsPanel,
  properties: PropertiesPanel
}

export default function Dockview() {
  function mount(event: DockviewReadyEvent) {
    const { api } = event
    const codePanel = api.addPanel({
      id: crypto.randomUUID(),
      title: 'Code',
      component: 'code',
      params: {
        Icon: <Puzzle size={16} />
      }
    })

    api.addPanel({
      id: crypto.randomUUID(),
      title: 'Model',
      component: 'model',
      params: {
        Icon: <PenTool size={16} />
      }
    })

    /* WIP    
    api.addPanel({
      id: crypto.randomUUID(),
      title: 'Assets',
      component: 'debug',
      params: {
        Icon: <Package size={16} />
      }
    })

    api.addPanel({
      id: crypto.randomUUID(),
      title: 'Extensions',
      component: 'debug',
      params: {
        Icon: <Shapes size={16} />
      }
    })
    */

    const scenePanel = api.addPanel({
      id: crypto.randomUUID(),
      component: 'scene',
      params: {
        Icon: <Airplay size={16} />
      },
      title: 'Scene',
      position: { direction: 'right' }
    })

    const propertiesPanel = api.addPanel({
      id: crypto.randomUUID(),
      title: 'Properties',
      component: 'properties',
      params: {
        Icon: <Wrench size={16} />
      },
      position: { referencePanel: scenePanel, direction: 'below' }
    })

    api.addPanel({
      id: crypto.randomUUID(),
      component: 'explorer',
      title: 'Explorer',
      params: {
        Icon: <Folder size={16} />
      },
      position: { referencePanel: propertiesPanel, direction: 'right' }
    })

    codePanel.focus()
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
