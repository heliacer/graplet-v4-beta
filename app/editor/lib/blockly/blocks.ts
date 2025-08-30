import { common } from "blockly"

export const objectRegistry = {
  options: [["",""]]
}

export const definitions = common.createBlockDefinitionsFromJsonArray([
  {
    type: 'onclickrun',
    message0: 'when run clicked',
    nextStatement: null,
    style: 'event_blocks'
  },
  {
    type: "input",
    message0: "%1",
    args0: [
      {
        type: "field_input",
        name: "VALUE",
      }
    ],
    output: null
  },
  {
    type: "moveunitsxyz",
    message0: "move %1 %2 units %3",
    args0: [
      {
        type: "field_dropdown",
        name: "OBJECT",
        options: () => objectRegistry.options
      },
      {
        type: "input_value",
        name: "UNITS",
        check: "Number"
      },
      {
        type: "field_dropdown",
        name: "DIRECTION",
        options: [
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
            "-Y"
          ],
          [
            "down",
            "Y"
          ],
        ]
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'motion_blocks'
  },
  {
    type: 'setposxyz',
    message0: 'set position to x: %1 y: %2 z: %3',
    args0: [
      {
        type: 'input_value',
        name: 'X',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'Y',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'Z',
        check: 'Number'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'motion_blocks'
  },
  {
    type: 'setscalexyz',
    message0: 'set scale to x: %1 y: %2 z: %3',
    args0: [
      {
        type: 'input_value',
        name: 'X',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'Y',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'Z',
        check: 'Number'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'motion_blocks'
  },
  {
    type: 'setroteulerxyz',
    message0: 'set rotation to euler x: %1 y: %2 z: %3',
    args0: [
      {
        type: 'input_value',
        name: 'X',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'Y',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'Z',
        check: 'Number'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'motion_blocks'
  },
  {
    type: "rotatexyz",
    message0: "rotate around %1 axis by %2 degrees",
    args0: [
      {
        type: "field_dropdown",
        name: "AXIS",
        options: [
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
        type: 'input_value',
        name: 'ANGLE',
        check: 'Number'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'motion_blocks'
  },
  {
    type: "translatexyz",
    message0: "translate %1 along %2 axis by %3 units",
    args0: [
      {
        type: "field_dropdown",
        name: "OBJECTS",
        options: () => objectRegistry.options
      },
      {
        type: "field_dropdown",
        name: "AXIS",
        options: [
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
        type: 'input_value',
        name: 'UNITS',
        check: 'Number'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'motion_blocks'
  },
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
        type: 'input_dummy',
      },
      {
        type: 'input_statement',
        name: 'ACTIONS'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'control_blocks'
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
    style: 'control_blocks'
  }
])