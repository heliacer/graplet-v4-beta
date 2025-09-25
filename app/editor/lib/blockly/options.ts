import { BlocklyOptions } from 'blockly'
import { toolbox } from './toolbox'
import { theme } from './theme'

export const blocklyOptions: BlocklyOptions = {
  toolbox: toolbox,
  theme: theme,
  renderer: 'graplet',
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
    startScale: 0.45,
    minScale: 0.1
  },
  plugins: {
    metricsManager: 'ContinuousMetrics',
    toolbox: 'ContinuousToolbox',
    flyoutsVerticalToolbox: 'ContinuousFlyout'
  }
}
