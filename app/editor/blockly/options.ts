import { BlocklyOptions } from 'blockly'
import { toolbox } from './toolbox'
import { theme } from './theme'
import { GrapletConnectionChecker } from './utils/connectionChecker'

export const blocklyOptions: BlocklyOptions = {
  toolbox: toolbox,
  theme: theme,
  renderer: 'graplet',
  trashcan: false,
  grid: {
    length: 2,
    spacing: 20,
    snap: true
  },
  zoom: {
    wheel: true,
    controls: true,
    startScale: 0.8,
    minScale: 0.05
  },
  oneBasedIndex: false,
  sounds: false,
  plugins: {
    metricsManager: 'ContinuousMetrics',
    toolbox: 'ContinuousToolbox',
    flyoutsVerticalToolbox: 'ContinuousFlyout',
    connectionChecker: GrapletConnectionChecker
  },
  media: './blockly'
}
