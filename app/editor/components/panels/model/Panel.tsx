import { GridviewReact, GridviewReadyEvent, Orientation } from 'dockview-react'
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
    api.fromJSON({
      grid: {
        root: {
          type: 'branch',
          data: [
            {
              type: 'leaf',
              data: {
                id: 'ribbon',
                component: 'ribbon',
                params: {
                  title: 'Model Ribbon'
                },
                snap: false
              },
              size: 42
            },
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
                  size: 700
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
                      size: 400
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
                      size: 400
                    }
                  ],
                  size: 210
                }
              ],
              size: 800
            }
          ],
          size: 950
        },
        width: 950,
        height: 800,
        orientation: Orientation.VERTICAL
      },
      activePanel: 'modifiers'
    })
  }

  return (
    <GridviewReact
      orientation={Orientation.VERTICAL}
      components={modelPanelComponents}
      onReady={mount}
    />
  )
}
