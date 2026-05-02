import { Orientation, SerializedDockview } from 'dockview-react'

/**
 * The default dockview layout
 */
export const dvLayout: SerializedDockview = {
  grid: {
    root: {
      type: 'branch',
      data: [
        {
          type: 'leaf',
          data: {
            views: ['code'],
            activeView: 'code',
            id: '1'
          },
          size: 3
        },
        {
          type: 'leaf',
          data: {
            views: ['scene'],
            activeView: 'scene',
            id: '2'
          },
          size: 3
        },
        {
          type: 'branch',
          data: [
            {
              type: 'leaf',
              data: {
                views: ['explorer'],
                activeView: 'explorer',
                id: '3'
              },
              size: 1
            },
            {
              type: 'leaf',
              data: {
                views: ['properties'],
                activeView: 'properties',
                id: '4'
              },
              size: 1
            }
          ],
          size: 1
        }
      ],
      size: 1
    },
    width: 1,
    height: 1,
    orientation: Orientation.HORIZONTAL
  },
  panels: {
    code: {
      id: 'code',
      contentComponent: 'code',
      tabComponent: 'props.defaultTabComponent',
      params: { iconType: 'Puzzle' },
      title: 'Code'
    },
    scene: {
      id: 'scene',
      contentComponent: 'scene',
      tabComponent: 'props.defaultTabComponent',
      params: { iconType: 'Airplay' },
      title: 'Scene'
    },
    explorer: {
      id: 'explorer',
      contentComponent: 'explorer',
      tabComponent: 'props.defaultTabComponent',
      params: { iconType: 'Folder' },
      title: 'Explorer'
    },
    properties: {
      id: 'properties',
      contentComponent: 'properties',
      tabComponent: 'props.defaultTabComponent',
      params: { iconType: 'Wrench' },
      title: 'Properties'
    }
  },
  activeGroup: '1'
}