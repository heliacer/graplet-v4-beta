import { DockviewApi } from 'dockview-react'
import { IconT } from '../types'

export function upsertPanel(
  api: DockviewApi | null,
  component: string,
  title: string,
  iconType: IconT
) {
  if (!api) return
  const panel = api.getPanel(component)
  if (panel) {
    panel.api.setActive()
  } else {
    api.addPanel({
      id: component,
      component,
      title,
      params: {
        iconType,
        closable: true
      },
      floating: {
        x: document.body.clientWidth / 2 - 450,
        y: document.body.clientHeight / 2 - 320,
        width: 900,
        height: 550
      }
    })
  }
}
