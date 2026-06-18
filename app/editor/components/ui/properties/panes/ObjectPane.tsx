import { Star } from 'lucide-react'
import { PaneItem, renderPaneItem } from '../PaneItem'

export function ObjectPane() {
  /**
   * @todo more serialization!!!!
   *
   * -> make action registry, so that everything is component level
   * and here everything is virtual :D
   *
   * -> action 'orbitCamera'
   * -> action ...
   */

  const items: PaneItem[] = [
    {
      type: 'text',
      label: 'Name',
      property: 'name'
    },
    {
      type: 'vec3',
      label: 'Position',
      property: 'position'
    },
    {
      type: 'vec3angle',
      label: 'Rotation',
      property: 'rotation'
    },
    {
      type: 'vec3',
      label: 'Scale',
      property: 'scale'
    },
    {
      type: 'button',
      label: 'button button click click',
      Icon: Star
    },
    {
      type: 'checkbox',
      label: 'im a checkbox yo'
    }
  ]

  const panes = items.map(renderPaneItem)
  return <>{...panes}</>
}
