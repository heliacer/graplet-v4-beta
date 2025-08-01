import { common } from "blockly"

export const definitions = common.createBlockDefinitionsFromJsonArray([
  {
    type: 'onclickrun',
    message0: 'when run clicked',
    nextStatement: null,
    style: 'events'
  },
  {
    type: "moveunitsxyz",
    message0: "move %1 units %2",
    args0: [
      {
        type: "field_number",
        name: "UNITS",
      },
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          [
            "forwards",
            "Z"
          ],
          [
            "backwards",
            "-Z"
          ],
          [
            "left",
            "-X"
          ],
          [
            "right",
            "X"
          ],
          [
            "up",
            "Y"
          ],
          [
            "down",
            "-Y"
          ],
        ]
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'motion'
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
    style: 'motion'
  },
  {
    type: 'setscalexyz',
    message0: 'set scale to x: %1 y: %2 z: %3',
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
    style: 'motion'
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
    style: 'motion'
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
    style: 'motion'
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
        name: "UNITS",
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'motion'
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
    style: 'control'
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
    style: 'control'
  },
])