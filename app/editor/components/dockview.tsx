'use client'

import {
  DockviewReact,
  DockviewReadyEvent,
  Orientation,
  SerializedDockview
} from 'dockview-react'
import '../styles/base.css'
import '../styles/dvtheme.css'
import { LeftControls, RightControls } from './ui/tabControls'
import TabHeader from './ui/tabHeader'

// Panels
import DebugPanel from './panels/DebugPanel'
import ScenePanel from './panels/ScenePanel'
import ExplorerPanel from './panels/ExplorerPanel'
import CodePanel from './panels/CodePanel'
import PropertiesPanel from './panels/PropertiesPanel'

const panelComponents = {
  debug: DebugPanel,
  code: CodePanel,
  scene: ScenePanel,
  explorer: ExplorerPanel,
  properties: PropertiesPanel
}

const jsonLayout: SerializedDockview = {
  grid: {
    root: {
      type: 'branch',
      data: [
        {
          type: 'leaf',
          data: {
            views: ['code'],
            activeView: 'code',
            id: '1'
          },
          size: 4
        },
        {
          type: 'leaf',
          data: {
            views: ['scene'],
            activeView: 'scene',
            id: '2'
          },
          size: 3
        },
        {
          type: 'branch',
          data: [
            {
              type: 'leaf',
              data: {
                views: ['explorer'],
                activeView: 'explorer',
                id: '3'
              },
              size: 1
            },
            {
              type: 'leaf',
              data: {
                views: ['properties'],
                activeView: 'properties',
                id: '4'
              },
              size: 1
            }
          ],
          size: 1
        }
      ],
      size: 1
    },
    width: 1,
    height: 1,
    orientation: Orientation.HORIZONTAL
  },
  panels: {
    code: {
      id: 'code',
      contentComponent: 'code',
      tabComponent: 'props.defaultTabComponent',
      params: { iconType: 'Puzzle' },
      title: 'Code'
    },
    scene: {
      id: 'scene',
      contentComponent: 'scene',
      tabComponent: 'props.defaultTabComponent',
      params: { iconType: 'Airplay' },
      title: 'Scene'
    },
    explorer: {
      id: 'explorer',
      contentComponent: 'explorer',
      tabComponent: 'props.defaultTabComponent',
      params: { iconType: 'Folder' },
      title: 'Explorer'
    },
    properties: {
      id: 'properties',
      contentComponent: 'properties',
      tabComponent: 'props.defaultTabComponent',
      params: { iconType: 'Wrench' },
      title: 'Properties'
    }
  },
  activeGroup: '1'
}

export default function GrapletDockview() {
  function mount(event: DockviewReadyEvent) {
    const { api } = event
    api.fromJSON(jsonLayout)
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
