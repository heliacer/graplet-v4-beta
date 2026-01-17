import { common } from 'blockly'

const logicBlocks = common.createBlockDefinitionsFromJsonArray([
  {
    type: 'repeat',
    message0: 'repeat %1 times %2 %3',
    args0: [
      {
        type: 'input_value',
        name: 'TIMES',
        check: 'Number'
      },
      {
        type: 'input_dummy'
      },
      {
        type: 'input_statement',
        name: 'ACTIONS'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'logic_blocks'
  },
  {
    type: 'wait',
    message0: 'wait %1 ms',
    args0: [
      {
        type: 'input_value',
        name: 'MS',
        check: 'Number'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'logic_blocks'
  }
])

common.defineBlocks(logicBlocks)
