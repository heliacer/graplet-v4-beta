'use client'

import {
  DockviewReact,
  DockviewReadyEvent,
  Orientation,
  SerializedDockview
} from 'dockview-react'
import '../styles/base.css'
import '../styles/dvtheme.css'
import { LeftControls, RightControls } from './ui/controls/tabControls'
import { TabHeader } from './ui/tabHeader'
import DebugPanel from './panels/DebugPanel'
import ScenePanel from './panels/ScenePanel'
import ExplorerPanel from './panels/ExplorerPanel'
import CodePanel from './panels/CodePanel'
import PropertiesPanel from './panels/PropertiesPanel'
import SettingsPanel from './panels/SettingsPanel'
import KeybindsPanel from './panels/KeybindsPanel'
import { useEffect } from 'react'
import { useEditor } from '../lib/state'

const panelComponents = {
  debug: DebugPanel,
  code: CodePanel,
  scene: ScenePanel,
  explorer: ExplorerPanel,
  properties: PropertiesPanel,
  settings: SettingsPanel,
  keybinds: KeybindsPanel
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
          size: 3
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

export function GrapletDockview() {
  const dvApi = useEditor(s => s.dvApi)
  const setDvApi = useEditor(s => s.setDvApi)

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
      api.fromJSON(jsonLayout)
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
        className: 'dv-theme'
      }}
      className='w-full h-full'
      onReady={mount}
      components={panelComponents}
      defaultTabComponent={TabHeader}
      leftHeaderActionsComponent={LeftControls}
      rightHeaderActionsComponent={RightControls}
    />
  )
}
