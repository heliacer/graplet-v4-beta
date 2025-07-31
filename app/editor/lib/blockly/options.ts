import { BlocklyOptions } from "blockly"
import { colors } from "./colors"

export const blocklyOptions: BlocklyOptions = {
  toolbox: {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: 'Motion',
        categorystyle: 'motion',
        contents: [
          {
            kind: 'block',
            type: 'setposxyz'
          },
          {
            kind: 'block',
            type: 'setroteulerxyz'
          },
          {
            kind: 'block',
            type: 'translatexyz',
            fields: {
              AXIS: 'Z',
              DISTANCE: 1
            }
          },
          {
            kind: 'block',
            type: 'rotatexyz',
            fields: {
              AXIS: 'Y',
              ANGLE: 15
            }
          }
        ]
      },
      {
        kind: 'category',
        name: 'Events',
        categorystyle: 'events',
        contents: [
          {
            kind: 'block',
            type: 'onclickrun'
          }
        ]
      },
      {
        kind: 'category',
        name: 'Control',
        categorystyle: 'control',
        contents: [
          {
            kind: 'block',
            type: 'repeat',
            fields: {
              TIMES: 10
            }
          },
          {
            kind: 'block',
            type: 'wait',
            fields: {
              MS: 1000
            }
          }
        ]
      }
    ]
  },
  theme: {
    name: 'graplet',
    componentStyles: {
      workspaceBackgroundColour: 'transparent',
      toolboxBackgroundColour: '#1f1f23',
      flyoutBackgroundColour: '#1f1f23',
      toolboxForegroundColour: '#e4e4e7',
      flyoutForegroundColour: '#e4e4e7',
      flyoutOpacity: 1,
      scrollbarColour: '#343437',
    },
    fontStyle: {
      family: 'Nunito, Nunito Fallback',
      weight: '400'
    },
    startHats: true,
    categoryStyles: {
      'motion': {
        colour: colors.MOTION
      },
      'events': {
        colour: colors.EVENTS
      },
      'control': {
        colour: colors.CONTROL
      }
    }
  },
  renderer: 'graplet',
  scrollbars: true,
  trashcan: false,
  grid: {
    length: 2,
    spacing: 30,
    snap: true
  },
  zoom: {
    wheel: true,
    controls: true,
    startScale: 0.8,
    maxScale: 1.2,
    minScale: 0.2
  },
  plugins: {
    metricsManager: 'ContinuousMetrics',
    toolbox: 'ContinuousToolbox',
    flyoutsVerticalToolbox: 'ContinuousFlyout'
  }
}