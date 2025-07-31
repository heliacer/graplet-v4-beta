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
            type: 'moveunitsxyz',
            fields: {
              UNITS: .5
            }
          },
          {
            kind: 'sep',
            gap: 32
          },
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
              UNITS: .5
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
              MS: 500
            }
          }
        ]
      },
      {
        kind: 'category',
        name: 'Variables',
        custom: 'VARIABLE',
        categorystyle: 'vars',
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
      weight: '600',
      size: 19
    },
    startHats: true,
    categoryStyles: {
      motion: {
        colour: colors.MOTION
      },
      events: {
        colour: colors.EVENTS
      },
      control: {
        colour: colors.CONTROL
      },
      vars : {
        colour: colors.VARS
      }
    },
    blockStyles: {
      motion : {
        colourPrimary: colors.MOTION
      },
      events: {
        colourPrimary: colors.EVENTS
      },
      control: {
        colourPrimary: colors.CONTROL
      },
      variable_blocks : {
        colourPrimary: colors.VARS
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
    maxScale: 2,
    startScale: .45,
    minScale: .1
  },
  plugins: {
    metricsManager: 'ContinuousMetrics',
    toolbox: 'ContinuousToolbox',
    flyoutsVerticalToolbox: 'ContinuousFlyout'
  }
}