import './motion'
import './events'
import './logic'
import './math'
import './functions'
import { common } from 'blockly'

export const blocklyUI: { objectMenu: string[][] } = { objectMenu: [] }

const commonBlocks = common.createBlockDefinitionsFromJsonArray([
  {
    type: 'string',
    message0: '%1',
    args0: [
      {
        type: 'field_input',
        name: 'VALUE'
      }
    ],
    output: null
  },
  {
    type: 'number',
    message0: '%1',
    args0: [
      {
        type: 'field_number',
        name: 'NUM'
      }
    ],
    output: null
  }
])

common.defineBlocks(commonBlocks)
