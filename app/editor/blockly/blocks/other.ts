import { common } from 'blockly'

const otherBlocks = common.createBlockDefinitionsFromJsonArray([
  {
    type: 'send_notification',
    message0: 'send notification with title: %1 and content: %2',
    args0: [
      {
        type: 'input_value',
        name: 'TITLE'
      },
      {
        type: 'input_value',
        name: 'CONTENT'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'other_blocks'
  }
])

common.defineBlocks(otherBlocks)
