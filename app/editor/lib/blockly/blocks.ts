import { common } from "blockly"

export const definitions = common.createBlockDefinitionsFromJsonArray([
  {
    type: 'onclickrun',
    message0: 'when scene is run',
    nextStatement: null,
    colour: 'red'
  },
  {
    type: 'setposxyz',
    message0: 'set position of cube to x: %1 y: %2 z: %3',
    args0: [
      {
        type: 'field_number',
        name: 'X',
      },
      {
        type: 'field_number',
        name: 'Y',
      },
      {
        type: 'field_number',
        name: 'Z',
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 'blue'
  }
])