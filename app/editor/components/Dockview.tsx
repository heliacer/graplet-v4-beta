'use client'

import '../styles/dvtheme.css'
import { DockviewReact, DockviewReadyEvent } from 'dockview-react'
import { LeftControls, RightControls } from './ui/controls/TabControls'
import { TabHeader } from './ui/TabHeader'
import { useEffect } from 'react'
import { useEditorStore } from '../state'
import { defaultLayout } from './defaultDockview'
import { useKeybind } from '../context/KeybindsContext'
import { useObjectActions } from '../hooks/useObjectActions'
import CreateFunctionPanel from './panels/CreateFunctionPanel'
import DebugPanel from './panels/DebugPanel'
import ScenePanel from './panels/ScenePanel'
import ExplorerPanel from './panels/ExplorerPanel'
import CodePanel from './panels/CodePanel'
import PropertiesPanel from './panels/PropertiesPanel'
import SettingsPanel from './panels/SettingsPanel'
import KeybindsPanel from './panels/KeybindsPanel'

const panelComponents = {
  debug: DebugPanel,
  code: CodePanel,
  scene: ScenePanel,
  explorer: ExplorerPanel,
  properties: PropertiesPanel,
  settings: SettingsPanel,
  keybinds: KeybindsPanel,
  createFunction: CreateFunctionPanel
}

export function GrapletDockview() {
  const dvApi = useEditorStore(s => s.dvApi)
  const selectedItems = useEditorStore(s => s.selectedItems)
  const { pasteObjects, copyObjects, removeObject } = useObjectActions()
  const setDvApi = useEditorStore(s => s.setDvApi)

  /**
   * @todo (#82) Move global effects out of specific panels and place them here
   * - could have a generic keybind handler here in a hook useGenericKeybinds
   */
  useKeybind(
    {
      key: 'c',
      modifiers: ['Ctrl']
    },
    () => {
      if (!dvApi || !dvApi.activePanel) return
      if (
        (dvApi.activePanel.id === 'explorer' ||
          dvApi.activePanel.id === 'scene') &&
        selectedItems.length > 0
      ) {
        copyObjects(selectedItems)
      }
    }
  )
  useKeybind(
    {
      key: 'Delete'
    },
    () => {
      if (!dvApi || !dvApi.activePanel) return
      if (
        (dvApi.activePanel.id === 'explorer' ||
          dvApi.activePanel.id === 'scene') &&
        selectedItems.length > 0
      ) {
        for (const sharedId of selectedItems) {
          removeObject(sharedId)
        }
      }
    }
  )
  useKeybind(
    {
      key: 'v',
      modifiers: ['Ctrl']
    },
    () => {
      if (!dvApi || !dvApi.activePanel) return
      if (
        dvApi.activePanel.id === 'explorer' ||
        dvApi.activePanel.id === 'scene'
      )
        pasteObjects()
    }
  )
  useKeybind(
    {
      key: 'Escape'
    },
    () => {
      if (!dvApi || !dvApi.activePanel) return
      const hasUnClosable = dvApi.activePanel.group.panels.some(
        panel => !panel.params?.closable
      )
      if (!hasUnClosable) {
        dvApi.activePanel.api.close()
      }
    }
  )

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
      api.fromJSON(defaultLayout)
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
      rightHeaderActionsComponent={RightControls}
      leftHeaderActionsComponent={LeftControls}
    />
  )
}
