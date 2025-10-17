import {
  GridviewApi,
  GridviewReact,
  GridviewReadyEvent,
  Orientation
} from 'dockview-react'
import ModelScene from './scene'
import Ribbon from './ribbon'
import Modifiers from './modifiers'
import Outline from './outline'
import { useState } from 'react'

const modelPanelComponents = {
  ribbon: Ribbon,
  outline: Outline,
  modifiers: Modifiers,
  scene: ModelScene
}

export default function ModelPanel() {
  const [api, setApi] = useState<GridviewApi>()

  function mount(event: GridviewReadyEvent) {
    const { api } = event

    api.addPanel({
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

    api.addPanel({
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

    setApi(api)
  }

  function setSizesPrimitive() {
    api?.getPanel('ribbon')?.api.setSize({ height: 30 })
    api?.getPanel('outline')?.api.setSize({ width: 220, height: 300 })
  }

  return (
    <>
      <button onClick={setSizesPrimitive}>resize</button>
      <GridviewReact
        orientation={Orientation.VERTICAL}
        components={modelPanelComponents}
        onReady={mount}
      />
    </>
  )
}
