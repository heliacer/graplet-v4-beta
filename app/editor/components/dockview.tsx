'use client'

import { DockviewReact, DockviewReadyEvent } from "dockview-react"
import '../styles/base.css'
import '../styles/theme.css'
import { Airplay, Package, PenTool, Puzzle, Shapes, Terminal, Wrench } from "lucide-react"
import { LeftControls, RightControls } from "./controls"
import TabHeader from "./tabHeader"

// Panels
import DebugPanel from "./panels/DebugPanel"

const panelComponents = {
  debug: DebugPanel
}

export default function Dockview() {
  function mount(event: DockviewReadyEvent) {
    event.api.addPanel({
      id: crypto.randomUUID(),
      title: 'Code',
      component: 'debug',
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
      title: 'Addons',
      component: 'debug',
      params: {
        Icon: <Shapes size={16} />
      }
    })

    const scenePanel = event.api.addPanel({
      id: crypto.randomUUID(),
      component: 'debug',
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
      id: crypto.randomUUID(), component: 'debug',
      title: 'Assets',
      params: {
        Icon: <Package size={16} />
      },
      position: { referencePanel: propertiesPanel, direction: 'right' }
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