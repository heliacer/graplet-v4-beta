import { GridviewReact, GridviewReadyEvent, Orientation } from 'dockview-react'
import ModelScene from './scene'
import Ribbon from './ribbon'
import Modifiers from './modifiers'
import Outline from './outline'

const modelPanelComponents = {
  outline: Outline,
  modifiers: Modifiers,
  scene: ModelScene
}

export default function ModelPanel() {
  function mount(event: GridviewReadyEvent) {
    const { api } = event
    api.fromJSON({
      grid: {
        root: {
          type: 'branch',
          data: [
            {
              type: 'branch',
              data: [
                {
                  type: 'leaf',
                  data: {
                    id: 'scene',
                    component: 'scene',
                    params: {
                      title: 'Model Scene'
                    },
                    snap: false
                  },
                  size: 460
                },
                {
                  type: 'branch',
                  data: [
                    {
                      type: 'leaf',
                      data: {
                        id: 'outline',
                        component: 'outline',
                        params: {
                          title: 'Model Outline'
                        },
                        snap: false
                      },
                      size: 300
                    },
                    {
                      type: 'leaf',
                      data: {
                        id: 'modifiers',
                        component: 'modifiers',
                        params: {
                          title: 'Model Modifiers'
                        },
                        snap: false
                      },
                      size: 520
                    }
                  ],
                  size: 140
                }
              ],
              size: 810
            }
          ],
          size: 680
        },
        width: 680,
        height: 810,
        orientation: Orientation.VERTICAL
      }
    })
  }

  return (
    <>
      <Ribbon />
      <GridviewReact
        orientation={Orientation.VERTICAL}
        components={modelPanelComponents}
        onReady={mount}
      />
    </>
  )
}
