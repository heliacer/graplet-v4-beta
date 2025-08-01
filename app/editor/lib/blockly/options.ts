import { BlocklyOptions } from "blockly"
import { colors } from "./colors"
import { toolbox } from "./toolbox"

export const blocklyOptions: BlocklyOptions = {
  toolbox: toolbox,
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
      motion_category: {
        colour: colors.MOTION
      },
      events_category: {
        colour: colors.EVENTS
      },
      control_category: {
        colour: colors.CONTROL
      },
      variables_category : {
        colour: colors.VARIABLES
      },
      math_category : {
        colour: colors.MATH
      }
    },
    blockStyles: {
      motion_blocks : {
        colourPrimary: colors.MOTION
      },
      event_blocks: {
        colourPrimary: colors.EVENTS
      },
      control_blocks: {
        colourPrimary: colors.CONTROL
      },
      variable_blocks : {
        colourPrimary: colors.VARIABLES
      },
      math_blocks : {
        colourPrimary: colors.MATH
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