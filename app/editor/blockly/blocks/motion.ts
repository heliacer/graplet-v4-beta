import { common } from 'blockly'
import { blocklyUI } from '.'

function options() {
  if (blocklyUI.objectMenu.length === 0) {
    return [['', '']]
  }
  return blocklyUI.objectMenu
}

const motionBlocks = common.createBlockDefinitionsFromJsonArray([
  {
    type: 'object',
    message0: '%1',
    args0: [
      {
        type: 'field_dropdown',
        name: 'VALUE',
        options
      }
    ],
    output: 'Object',
    style: 'motion_blocks'
  },
  {
    type: 'objectvec3prop',
    message0: '%1 on axis %2 of %3',
    args0: [
      {
        type: 'field_dropdown',
        name: 'PROP',
        options: [
          ['position', 'position'],
          ['rotation', 'rotation'],
          ['scale', 'scale']
        ]
      },
      {
        type: 'field_dropdown',
        name: 'AXIS',
        options: [
          ['x', 'x'],
          ['y', 'y'],
          ['z', 'z']
        ]
      },
      {
        type: 'input_value',
        name: 'OBJECT',
        check: 'Object'
      }
    ],
    output: 'Number',
    style: 'motion_blocks'
  },
  {
    type: 'moveunitsxyz',
    message0: 'move %1 %2 units %3',
    args0: [
      {
        type: 'input_value',
        name: 'OBJECT',
        check: 'Object'
      },
      {
        type: 'input_value',
        name: 'UNITS',
        check: 'Number'
      },
      {
        type: 'field_dropdown',
        name: 'DIRECTION',
        options: [
          ['forwards', 'Z'],
          ['backwards', '-Z'],
          ['left', '-X'],
          ['right', 'X'],
          ['up', 'Y'],
          ['down', '-Y']
        ]
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'motion_blocks'
  },
  {
    type: 'setposxyz',
    message0: 'set position of %1 to x: %2 y: %3 z: %4',
    args0: [
      {
        type: 'input_value',
        name: 'OBJECT',
        check: 'Object'
      },
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
    message0: 'set scale of %1 to x: %2 y: %3 z: %4',
    args0: [
      {
        type: 'input_value',
        name: 'OBJECT',
        check: 'Object'
      },
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
    message0: 'set rotation of %1 to euler x: %2 y: %3 z: %4',
    args0: [
      {
        type: 'input_value',
        name: 'OBJECT',
        check: 'Object'
      },
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
    type: 'rotatexyz',
    message0: 'rotate %1 around %2 axis by %3 degrees',
    args0: [
      {
        type: 'input_value',
        name: 'OBJECT',
        check: 'Object'
      },
      {
        type: 'field_dropdown',
        name: 'AXIS',
        options: [
          ['x', 'X'],
          ['y', 'Y'],
          ['z', 'Z']
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
    type: 'translatexyz',
    message0: 'translate %1 along %2 axis by %3 units',
    args0: [
      {
        type: 'input_value',
        name: 'OBJECT',
        check: 'Object'
      },
      {
        type: 'field_dropdown',
        name: 'AXIS',
        options: [
          ['x', 'X'],
          ['y', 'Y'],
          ['z', 'Z']
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
  }
])

common.defineBlocks(motionBlocks)
