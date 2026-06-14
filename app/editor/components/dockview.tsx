'use client'

import '../styles/dvtheme.css'
import { DockviewReact, DockviewReadyEvent } from 'dockview-react'
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
import { useEditorStore } from '../state'
import { defaultLayout } from './defaultDockview'
import { useKeybind } from '../context/keybinds'
import { useObjectActions } from '../hooks/useObjectActions'
import { Object3D } from 'three'
import { useEditorRefs } from '../context/editor'
import { NotFoundError } from '../types'
import CreateFunctionPanel from './panels/CreateFunctionPanel'

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
  const { objectsRef } = useEditorRefs()
  const dvApi = useEditorStore(s => s.dvApi)
  const selectedItems = useEditorStore(s => s.selectedItems)
  const { pasteObjects, copyObjects } = useObjectActions()
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
      if (dvApi.activePanel.id === 'explorer' && selectedItems.length) {
        const objectsToCopy: Object3D[] = selectedItems.map(item => {
          const object = objectsRef.current.get(item)
          if (object === undefined) throw new NotFoundError(item)
          return object
        })
        copyObjects(objectsToCopy)
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
      if (dvApi.activePanel.id === 'explorer') pasteObjects()
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
