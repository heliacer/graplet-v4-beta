import { Block, Input, Workspace } from 'blockly'
import { Value, Expression, ExpressionT } from './ast'

export class ExpressionGenerator {
  private generators: Record<
    string,
    (block: Block, generator: ExpressionGenerator) => Expression
  > = {}

  forBlock(
    blockType: string,
    generatorFn: (block: Block, generator: ExpressionGenerator) => Expression
  ) {
    this.generators[blockType] = generatorFn
  }

  getInputValue(
    block: Block,
    inputName: string,
    defaultValue: Value
  ): Expression {
    const input = block.getInput(inputName)
    if (!input || !input.connection)
      throw Error(`Block input ${inputName} was not found`)

    const connectedBlock = input.connection.targetBlock()
    if (!connectedBlock) {
      return {
        type: 'literal',
        value: defaultValue
      }
    }

    const generator = this.generators[connectedBlock.type]
    if (!generator)
      throw Error(`No generator found for block type ${connectedBlock.type}`)
    return generator(connectedBlock, this)
  }

  blockToExpression(block: Block): Expression {
    const generator = this.generators[block.type]
    if (!generator)
      throw Error(`No generator found for block type ${block.type}`)
    return generator(block, this)
  }

  workspaceToExpression(workspace: Workspace): Expression {
    const topBlocks = workspace.getTopBlocks(true)
    const entries = topBlocks.map(block => this.blockToExpression(block))

    return {
      type: 'main',
      children: entries
    }
  }

  getConnectedExpressions(triggerBlock: Block): Expression[] {
    const exprs: Expression[] = []
    let currentBlock = triggerBlock.getNextBlock()
    while (currentBlock) {
      const expression = this.blockToExpression(currentBlock)
      exprs.push(expression)
      currentBlock = currentBlock.getNextBlock()
    }
    return exprs
  }
}

type ExtraState = {
  name: string
  params?: string[]
}

export const exprGenerator = new ExpressionGenerator()

exprGenerator.forBlock('number', function (block: Block): Expression {
  return {
    type: 'literal',
    value: block.getFieldValue('NUM')
  }
})

exprGenerator.forBlock('text', function (block: Block): Expression {
  const value = block.getFieldValue('VALUE') as Value

  const resolved = Number.isNaN(Number(value)) ? value : Number(value)
  return {
    type: 'literal',
    value: resolved
  }
})

// MOTION
exprGenerator.forBlock('object', function (block: Block): Expression {
  const objectId = block.getFieldValue('VALUE')
  return {
    type: 'literal',
    value: objectId
  }
})

exprGenerator.forBlock(
  'moveunitsxyz',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const objectExpr = generator.getInputValue(block, 'OBJECT', '')
    const unitsExpr = generator.getInputValue(block, 'UNITS', 0)
    const direction = block.getFieldValue('DIRECTION') as string
    const axis = direction.slice(-1)

    return {
      type: 'translatexyz',
      args: [
        objectExpr,
        { type: 'literal', value: axis },
        { type: 'literal', value: direction.startsWith('-') ? -1 : 1 },
        unitsExpr
      ]
    }
  }
)

exprGenerator.forBlock('setposxyz', createXYZExpr('setposxyz'))
exprGenerator.forBlock('setscalexyz', createXYZExpr('setscalexyz'))
exprGenerator.forBlock('setroteulerxyz', createXYZExpr('setroteulerxyz'))

exprGenerator.forBlock(
  'rotatexyz',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const objectExpr = generator.getInputValue(block, 'OBJECT', '')
    const axis = block.getFieldValue('AXIS') as string
    const angle = generator.getInputValue(block, 'ANGLE', 0)
    return {
      type: 'rotatexyz',
      args: [objectExpr, { type: 'literal', value: axis }, angle]
    }
  }
)

exprGenerator.forBlock(
  'translatexyz',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const objectExpr = generator.getInputValue(block, 'OBJECT', '')
    const axis = block.getFieldValue('AXIS') as string
    const distanceExpr = generator.getInputValue(block, 'UNITS', 0)

    return {
      type: 'translatexyz',
      args: [objectExpr, { type: 'literal', value: axis }, distanceExpr]
    }
  }
)

// EVENTS
exprGenerator.forBlock('onflagclick', function (block: Block): Expression {
  const connectedExprs = exprGenerator.getConnectedExpressions(block)
  return { type: 'runseq', children: connectedExprs }
})

// LOGIC
exprGenerator.forBlock(
  'repeat',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const valueExpr = generator.getInputValue(block, 'TIMES', 0)
    const exprs: Expression[] = generateExprsFromInput(
      block.getInput('ACTIONS'),
      generator
    )

    return {
      type: 'repeat',
      args: [valueExpr],
      children: exprs
    }
  }
)

exprGenerator.forBlock(
  'controls_if',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const branches: Expression[] = []
    const conditions: Expression[] = []

    let i = 0
    while (block.getInput('IF' + i)) {
      const conditionExpr = generator.getInputValue(block, 'IF' + i, false)
      conditions.push(conditionExpr)
      const doExprs: Expression[] = generateExprsFromInput(
        block.getInput('DO' + i),
        generator
      )
      branches.push({
        type: 'runseq',
        children: doExprs
      })
      i++
    }

    const elseExprs: Expression[] = generateExprsFromInput(
      block.getInput('ELSE'),
      generator
    )
    branches.push({
      type: 'runseq',
      children: elseExprs
    })

    return {
      type: 'if',
      args: conditions,
      children: branches // {[doExprs]} , {[elseExprs]}
    }
  }
)

exprGenerator.forBlock(
  'controls_ifelse',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const condition = generator.getInputValue(block, 'IF0', false)
    const doExprs: Expression[] = generateExprsFromInput(
      block.getInput('DO0'),
      generator
    )
    const elseExprs: Expression[] = generateExprsFromInput(
      block.getInput('ELSE'),
      generator
    )

    return {
      type: 'if',
      args: [condition],
      children: [
        { type: 'runseq', children: doExprs },
        { type: 'runseq', children: elseExprs }
      ]
    }
  }
)

exprGenerator.forBlock(
  'wait',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const msExpr = generator.getInputValue(block, 'MS', 0)
    return {
      type: 'wait',
      args: [msExpr]
    }
  }
)

exprGenerator.forBlock('logic_boolean', function (block: Block): Expression {
  const bool = block.getFieldValue('BOOL') as 'TRUE' | 'FALSE'
  return {
    type: 'literal',
    value: bool === 'TRUE' ? true : false
  }
})
exprGenerator.forBlock(
  'logic_operation',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const operator = block.getFieldValue('OP')
    const aExpr = generator.getInputValue(block, 'A', false)
    const bExpr = generator.getInputValue(block, 'B', false)

    return {
      type: 'andor',
      value: operator,
      args: [aExpr, bExpr]
    }
  }
)

exprGenerator.forBlock(
  'logic_negate',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const boolExpr = generator.getInputValue(block, 'BOOL', false)
    return {
      type: 'neg',
      args: [boolExpr]
    }
  }
)

exprGenerator.forBlock(
  'logic_compare',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const operator = block.getFieldValue('OP')
    const aExpr = generator.getInputValue(block, 'A', 0)
    const bExpr = generator.getInputValue(block, 'B', 0)

    return {
      type: 'compare',
      value: operator,
      args: [aExpr, bExpr]
    }
  }
)

// MATH
exprGenerator.forBlock(
  'math_change',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const varId = block.getFieldValue('VAR') as string
    const variable = block.workspace.getVariableMap().getVariableById(varId)
    const deltaExpr = generator.getInputValue(block, 'DELTA', 0)
    return {
      type: 'changevar',
      value: variable?.getName(),
      args: [deltaExpr]
    }
  }
)

exprGenerator.forBlock(
  'math_arithmetic',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const operator = block.getFieldValue('OP')
    const aExpr = generator.getInputValue(block, 'A', 0)
    const bExpr = generator.getInputValue(block, 'B', 0)

    return {
      type: 'arithmetic',
      value: operator,
      args: [aExpr, bExpr]
    }
  }
)

exprGenerator.forBlock(
  'math_map',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const xExpr = generator.getInputValue(block, 'NUM', 0)
    const fromMinExpr = generator.getInputValue(block, 'FROM_MIN', 0)
    const fromMaxExpr = generator.getInputValue(block, 'FROM_MAX', 0)
    const toMinExpr = generator.getInputValue(block, 'TO_MIN', 0)
    const toMaxExpr = generator.getInputValue(block, 'TO_MAX', 0)

    return {
      type: 'map',
      args: [xExpr, fromMinExpr, fromMaxExpr, toMinExpr, toMaxExpr]
    }
  }
)

exprGenerator.forBlock('math_constant', function (block: Block): Expression {
  const constant = block.getFieldValue('CONSTANT') as string

  const constants: Record<string, number> = {
    PI: Math.PI,
    E: Math.E,
    GOLDEN_RATIO: (1 + Math.sqrt(5)) / 2,
    SQRT2: Math.SQRT2,
    SQRT1_2: Math.SQRT1_2,
    INFINITY: Infinity
  }

  return {
    type: 'literal',
    value: constants[constant]
  }
})

exprGenerator.forBlock(
  'math_trig',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const xExpr = generator.getInputValue(block, 'NUM', 0)
    const operator = block.getFieldValue('OP')

    return {
      type: 'trig',
      value: operator,
      args: [xExpr]
    }
  }
)

exprGenerator.forBlock(
  'math_htrig',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const xExpr = generator.getInputValue(block, 'NUM', 0)
    const operator = block.getFieldValue('OP')

    return {
      type: 'htrig',
      value: operator,
      args: [xExpr]
    }
  }
)

exprGenerator.forBlock(
  'math_round',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const xExpr = generator.getInputValue(block, 'NUM', 0)
    const operator = block.getFieldValue('OP')

    return {
      type: 'round',
      value: operator,
      args: [xExpr]
    }
  }
)

exprGenerator.forBlock(
  'math_single',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const xExpr = generator.getInputValue(block, 'NUM', 0)
    const operator = block.getFieldValue('OP')

    return {
      type: 'single',
      value: operator,
      args: [xExpr]
    }
  }
)

exprGenerator.forBlock(
  'math_atan2',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const xExpr = generator.getInputValue(block, 'X', 0)
    const yExpr = generator.getInputValue(block, 'Y', 0)

    return {
      type: 'atan2',
      args: [xExpr, yExpr]
    }
  }
)

exprGenerator.forBlock(
  'math_modulo',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const dividendExpr = generator.getInputValue(block, 'DIVIDEND', 0)
    const divisorExpr = generator.getInputValue(block, 'DIVISOR', 0)

    return {
      type: 'modulo',
      args: [dividendExpr, divisorExpr]
    }
  }
)

exprGenerator.forBlock(
  'math_constrain',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const valueExpr = generator.getInputValue(block, 'VALUE', 0)
    const lowExpr = generator.getInputValue(block, 'LOW', 0)
    const highExpr = generator.getInputValue(block, 'HIGH', 0)

    return {
      type: 'constrain',
      args: [valueExpr, lowExpr, highExpr]
    }
  }
)

exprGenerator.forBlock('math_random_float', function (): Expression {
  return {
    type: 'randomfloat'
  }
})

exprGenerator.forBlock(
  'math_random_int',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const fromExpr = generator.getInputValue(block, 'FROM', 0)
    const toExpr = generator.getInputValue(block, 'TO', 0)

    return {
      type: 'randomint',
      args: [fromExpr, toExpr]
    }
  }
)

// VARIABLES
exprGenerator.forBlock('variables_get', function (block: Block): Expression {
  const varId = block.getFieldValue('VAR') as string
  const variable = block.workspace.getVariableMap().getVariableById(varId)
  return {
    type: 'var',
    value: variable?.getName()
  }
})

exprGenerator.forBlock(
  'variables_set',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const varId = block.getFieldValue('VAR') as string
    const variable = block.workspace.getVariableMap().getVariableById(varId)

    const valueExpr = generator.getInputValue(block, 'VALUE', 0)
    return {
      type: 'setvar',
      value: variable?.getName(),
      args: [valueExpr]
    }
  }
)

// FUNCTIONS
exprGenerator.forBlock(
  'procedures_defnoreturn',
  /** @deprecated legacy built-in functions */
  function (block: Block, generator: ExpressionGenerator): Expression {
    const exprs: Expression[] = generateExprsFromInput(
      block.getInput('STACK'),
      generator
    )
    const name = block.getFieldValue('NAME') as string

    return {
      type: 'setfunc',
      value: name,
      children: exprs
    }
  }
)

exprGenerator.forBlock(
  'procedures_defreturn',
  /** @deprecated legacy built-in functions */
  function (block: Block, generator: ExpressionGenerator): Expression {
    const exprs: Expression[] = generateExprsFromInput(
      block.getInput('STACK'),
      generator
    )
    const name = block.getFieldValue('NAME') as string
    const returnExpr = generator.getInputValue(block, 'RETURN', 0)

    return {
      type: 'setfunc',
      value: name,
      args: [returnExpr],
      children: exprs
    }
  }
)

exprGenerator.forBlock(
  'procedures_callnoreturn',
  /** @deprecated legacy built-in functions */
  function (block: Block, generator: ExpressionGenerator): Expression {
    const extraState =
      block.saveExtraState && (block.saveExtraState(true) as ExtraState)
    if (!extraState) throw Error('Extrastate does not exist.')

    const argsExprs: Expression[] = []
    extraState.params?.forEach((param, i) => {
      const argExpr = generator.getInputValue(block, `ARG${i}`, 0)
      argsExprs.push({
        type: 'setvar',
        value: param,
        args: [argExpr]
      })
    })
    return {
      type: 'call',
      args: argsExprs,
      value: extraState.name
    }
  }
)

exprGenerator.forBlock(
  'procedures_callreturn',
  /** @deprecated legacy built-in functions */
  function (block: Block, generator: ExpressionGenerator): Expression {
    const extraState =
      block.saveExtraState && (block.saveExtraState(true) as ExtraState)
    if (!extraState) throw Error('Extrastate does not exist.')

    const argsExprs: Expression[] = []
    extraState.params?.forEach((param, i) => {
      const argExpr = generator.getInputValue(block, `ARG${i}`, 0)
      argsExprs.push({
        type: 'setvar',
        value: param,
        args: [argExpr]
      })
    })
    return {
      type: 'call',
      args: argsExprs,
      value: extraState.name
    }
  }
)

/**
 * Helper Functions
 */

export function generateExprsFromInput(
  input: Input | null,
  generator: ExpressionGenerator
): Expression[] {
  const exprs: Expression[] = []
  if (input?.connection?.targetBlock()) {
    let currentBlock = input.connection.targetBlock()
    while (currentBlock) {
      const action = generator.blockToExpression(currentBlock)
      if (action) {
        exprs.push(action)
      }
      currentBlock = currentBlock.getNextBlock()
    }
  }
  return exprs
}

function createXYZExpr(type: ExpressionT) {
  return function (block: Block, generator: ExpressionGenerator): Expression {
    const objectExpr = generator.getInputValue(block, 'OBJECT', '')
    const xExpr = generator.getInputValue(block, 'X', 0)
    const yExpr = generator.getInputValue(block, 'Y', 0)
    const zExpr = generator.getInputValue(block, 'Z', 0)
    return {
      type,
      args: [objectExpr, xExpr, yExpr, zExpr]
    }
  }
}
