import { GridviewReact, GridviewReadyEvent, LayoutPriority, Orientation } from 'dockview-react'
import ModelScene from './scene'
import Ribbon from './ribbon'
import Modifiers from './modifiers'
import Outline from './outline'
import { title } from 'process'

const modelPanelComponents = {
  ribbon: Ribbon,
  outline: Outline,
  modifiers: Modifiers,
  scene: ModelScene
}

export default function ModelPanel() {
  function mount(event: GridviewReadyEvent) {
    const { api } = event

    const ribbonPanel = api.addPanel({
      id: crypto.randomUUID(),
      component: 'ribbon',
      params: {
        title: 'Model Ribbon'
      },
      minimumHeight: 30,
      maximumHeight: 60,
    })

    const scenePanel = api.addPanel({
      id: crypto.randomUUID(),
      component: 'scene',
      params: {
        title: 'Model Scene'
      },
      position: { referencePanel: ribbonPanel.id, direction: 'below' },
    })

    const outlinePanel = api.addPanel({
      id: crypto.randomUUID(),
      component: 'outline',
      params: {
        title: 'Model Outline'
      },
      position: { referencePanel: scenePanel.id, direction: 'right' },
    })

    api.addPanel({
      id: crypto.randomUUID(),
      component: 'modifiers',
      params: {
        title: 'Model Modifiers'
      },
      position: { referencePanel: outlinePanel.id, direction: 'below' }
    })
  }

  return (
    <GridviewReact
      orientation={Orientation.HORIZONTAL}
      components={modelPanelComponents}
      onReady={mount}
    />
  )
}
