import { common } from 'blockly'

const mathBlocks = common.createBlockDefinitionsFromJsonArray([
  {
    type: 'math_map',
    message0: 'map %1 from %2 , %3 to %4 , %5',
    args0: [
      {
        type: 'input_value',
        name: 'NUM',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'FROM_MIN',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'FROM_MAX',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'TO_MIN',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'TO_MAX',
        check: 'Number'
      }
    ],
    output: 'Number',
    style: 'math_blocks',
    inputsInline: true
  },
  {
    type: 'math_htrig',
    message0: '%1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'OP',
        options: [
          ['sinh', 'SINH'],
          ['cosh', 'COSH'],
          ['tanh', 'TANH'],
          ['arcsinh', 'ASINH'],
          ['arccosh', 'ACOSH'],
          ['arctanh', 'ATANH']
        ]
      },
      {
        type: 'input_value',
        name: 'NUM',
        check: 'Number'
      }
    ],
    output: 'Number',
    style: 'math_blocks',
    inputsInline: true
  }
])

common.defineBlocks(mathBlocks)
