'use client'

import { DockviewReact, DockviewReadyEvent } from 'dockview-react'
import '../styles/base.css'
import '../styles/dvtheme.css'
import {
  Airplay,
  Folder,
  Package,
  PenTool,
  Puzzle,
  Shapes,
  Wrench
} from 'lucide-react'
import { LeftControls, RightControls } from './controls'
import TabHeader from './tabHeader'
import { Canvas } from '@react-three/fiber'

// Panels
import DebugPanel from './panels/DebugPanel'
import ScenePanel from './panels/ScenePanel'
import AssetsPanel from './panels/AssetsPanel'
import ExplorerPanel from './panels/ExplorerPanel'
import CodePanel from './panels/CodePanel'
import PropertiesPanel from './panels/PropertiesPanel'
const panelComponents = {
  debug: DebugPanel,
  code: CodePanel,
  scene: function () {
    return (
      <Canvas>
        <ScenePanel />
      </Canvas>
    )
  },
  explorer: ExplorerPanel,
  assets: AssetsPanel,
  properties: PropertiesPanel
}

export default function Dockview() {
  function mount(event: DockviewReadyEvent) {
    const codePanel = event.api.addPanel({
      id: crypto.randomUUID(),
      title: 'Code',
      component: 'code',
      params: {
        Icon: <Puzzle size={16} />
      }
    })

    event.api.addPanel({
      id: crypto.randomUUID(),
      title: 'Model',
      component: 'debug',
      params: {
        Icon: <PenTool size={16} />
      }
    })

    event.api.addPanel({
      id: crypto.randomUUID(),
      title: 'Assets',
      component: 'assets',
      params: {
        Icon: <Package size={16} />
      }
    })

    event.api.addPanel({
      id: crypto.randomUUID(),
      title: 'Extensions',
      component: 'debug',
      params: {
        Icon: <Shapes size={16} />
      }
    })

    const scenePanel = event.api.addPanel({
      id: crypto.randomUUID(),
      component: 'scene',
      params: {
        Icon: <Airplay size={16} />
      },
      title: 'Scene',
      position: { direction: 'right' }
    })

    const propertiesPanel = event.api.addPanel({
      id: crypto.randomUUID(),
      title: 'Properties',
      component: 'properties',
      params: {
        Icon: <Wrench size={16} />
      },
      position: { referencePanel: scenePanel, direction: 'below' }
    })

    event.api.addPanel({
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
