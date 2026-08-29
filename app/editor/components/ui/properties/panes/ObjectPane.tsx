import { Star } from 'lucide-react'
import { PaneItem, renderPaneItem } from '../PaneItem'

export function ObjectPane() {
  /**
   * @todo (#57) PropertyPanel: Serialize Inputs
   * more serialization!
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
      property: 'name'
    },
    {
      type: 'vec3',
      property: 'position'
    },
    {
      type: 'vec3angle',
      property: 'rotation'
    },
    {
      type: 'vec3',
      property: 'scale'
    },
    {
      type: 'button',
      label: 'nuclear launch button',
      Icon: Star,
      onClick: () => alert('kaboom')
    },
    {
      type: 'checkbox',
      label: `I'm a checkbox and what's up`
    }
  ]

  const panes = items.map(renderPaneItem)
  return <>{...panes}</>
}
