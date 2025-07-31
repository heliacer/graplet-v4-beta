'use client'

import { DockviewReact, DockviewReadyEvent } from "dockview-react"
import '../styles/base.css'
import '../styles/dvtheme.css'
import { Airplay, Folder, Package, PenTool, Puzzle, Shapes, Terminal, Wrench } from "lucide-react"
import { LeftControls, RightControls } from "./controls"
import TabHeader from "./tabHeader"

// Panels
import DebugPanel from "./panels/DebugPanel"
import ScenePanel from "./panels/ScenePanel"
import AssetsPanel from "./panels/AssetsPanel"
import ExplorerPanel from "./panels/ExplorerPanel"
import CodePanel from "./panels/CodePanel"

const panelComponents = {
  debug: DebugPanel,
  code: CodePanel,
  scene: ScenePanel,
  explorer: ExplorerPanel,
  assets: AssetsPanel
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

    event.api.addPanel({
      id: crypto.randomUUID(),
      title: 'Console',
      component: 'debug',
      params: {
        Icon: <Terminal size={16} />
      }
    })

    scenePanel.focus()

    const propertiesPanel = event.api.addPanel({
      id: crypto.randomUUID(),
      title: 'Properties',
      component: 'debug',
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