import { DockviewApi } from 'dockview-react'
import { IconT } from '../types'

export function upsertPanel(
  api: DockviewApi | null,
  component: string,
  title?: string,
  iconType?: IconT,
  closeIfActive?: boolean,
  width: number = 800,
  height: number = 550
) {
  if (!api) return
  const panel = api.getPanel(component)
  if (panel) {
    if (closeIfActive && panel.api.isActive) {
      panel.api.close()
      return
    }
    panel.api.setActive()
    return
  }
  api.addPanel({
    id: component,
    component,
    title,
    params: {
      iconType,
      closable: true
    },
    floating: {
      x: document.body.clientWidth / 2 - width / 2,
      y: document.body.clientHeight / 2 - height / 2,
      width,
      height
    }
  })
}
