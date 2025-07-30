import { common } from "blockly"
import { colors } from "./colors"

export const definitions = common.createBlockDefinitionsFromJsonArray([
  {
    type: 'onclickrun',
    message0: 'when run clicked',
    nextStatement: null,
    colour: colors.EVENTS
  },
  {
    type: 'setposxyz',
    message0: 'set position to x: %1 y: %2 z: %3',
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
    colour: colors.MOTION
  },
  {
    type: 'setroteulerxyz',
    message0: 'set rotation to euler x: %1 y: %2 z: %3',
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
    colour: colors.MOTION
  },
  {
    type: "rotatexyz",
    message0: "rotate around %1 axis by %2 degrees",
    args0: [
      {
        "type": "field_dropdown",
        "name": "AXIS",
        "options": [
          [
            "x",
            "X"
          ],
          [
            "y",
            "Y"
          ],
          [
            "z",
            "Z"
          ]
        ]
      },
      {
        type: "field_number",
        name: "ANGLE",
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: colors.MOTION
  },
  {
    type: "translatexyz",
    message0: "translate along %1 axis by %2 units",
    args0: [
      {
        "type": "field_dropdown",
        "name": "AXIS",
        "options": [
          [
            "x",
            "X"
          ],
          [
            "y",
            "Y"
          ],
          [
            "z",
            "Z"
          ]
        ]
      },
      {
        type: "field_number",
        name: "DISTANCE",
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: colors.MOTION
  },
  {
    type: 'repeat',
    message0: 'repeat %1 times %2 %3',
    args0: [
      {
        type: 'field_number',
        name: 'TIMES',
      },
      {
        type: 'input_dummy',
      },
      {
        type: 'input_statement',
        name: 'ACTIONS'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: colors.CONTROL
  },
  {
    type: 'wait',
    message0: 'wait %1 ms',
    args0: [
      {
        type: 'field_number',
        name: 'MS',
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: colors.CONTROL
  }
])