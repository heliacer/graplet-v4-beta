import {
  GridviewReact,
  GridviewReadyEvent,
  Orientation
} from 'dockview-react'
import ModelScene from './scene'
import Ribbon from './ribbon'
import Modifiers from './modifiers'
import Outline from './outline'

const modelPanelComponents = {
  ribbon: Ribbon,
  outline: Outline,
  modifiers: Modifiers,
  scene: ModelScene
}

export default function ModelPanel() {
  function mount(event: GridviewReadyEvent) {
    const { api } = event

    const ribbon = api.addPanel({
      id: 'ribbon',
      component: 'ribbon',
      params: {
        title: 'Model Ribbon'
      },
      minimumHeight: 30,
      maximumHeight: 60
    })

    api.addPanel({
      id: 'scene',
      component: 'scene',
      params: {
        title: 'Model Scene'
      },
      position: { referencePanel: 'ribbon', direction: 'below' }
    })

    const outline = api.addPanel({
      id: 'outline',
      component: 'outline',
      params: {
        title: 'Model Outline'
      },
      position: { referencePanel: 'scene', direction: 'right' }
    })

    api.addPanel({
      id: 'modifiers',
      component: 'modifiers',
      params: {
        title: 'Model Modifiers'
      },
      position: { referencePanel: 'outline', direction: 'below' }
    })

    setTimeout(() => {
      ribbon.api.setSize({ height: 30 })
      outline.api.setSize({ width: 220, height: 300 })
    }, 1000)
  }

  return (
    <>
      <GridviewReact
        orientation={Orientation.VERTICAL}
        components={modelPanelComponents}
        onReady={mount}
      />
    </>
  )
}
