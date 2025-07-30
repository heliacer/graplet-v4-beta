import { BlocklyOptions } from "blockly"
import { toolbox } from "./toolbox"

export const blocklyOptions: BlocklyOptions = {
  toolbox: toolbox,
  theme: {
    name: 'graplet',
    componentStyles: {
      workspaceBackgroundColour: 'transparent'
    },
    fontStyle: {
      family: 'Nunito, Nunito Fallback',
      weight: '400'
    },
    startHats: true,
    categoryStyles: {
      'motion': {
        colour: 'black'
      },
      'events': {
        colour: 'black'
      },
      'control': {
        colour: 'black'
      }
    }
  },
  renderer: 'thrasos',
  scrollbars: true,
  trashcan: true,
  grid: {
    length: 4,
    spacing: 20
  },
  zoom: {
    startScale: 0.9
  },
  plugins: {
    metricsManager: 'ContinuousMetrics',
    toolbox: 'ContinuousToolbox',
    flyoutsVerticalToolbox: 'ContinuousFlyout'
  },
}