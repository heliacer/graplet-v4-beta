import { Block, Input, Workspace } from 'blockly'
import { Value, Expression, ExpressionT } from '../types'

export class ExpressionGenerator {
  private blockGenerators: Record<
    string,
    (block: Block, generator: ExpressionGenerator) => Expression
  > = {}
  private valueGenerators: Record<
    string,
    (block: Block, generator: ExpressionGenerator) => Expression
  > = {}

  forBlock(
    blockType: string,
    generatorFn: (block: Block, generator: ExpressionGenerator) => Expression
  ) {
    this.blockGenerators[blockType] = generatorFn
  }

  forValueBlock(
    blockType: string,
    generatorFn: (block: Block, generator: ExpressionGenerator) => Expression
  ) {
    this.valueGenerators[blockType] = generatorFn
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

    const valueGenerator = this.valueGenerators[connectedBlock.type]
    if (!valueGenerator)
      throw Error(
        `No value generator found for block type ${connectedBlock.type}`
      )
    return valueGenerator(connectedBlock, this)
  }

  blockToExpression(block: Block): Expression {
    const generator = this.blockGenerators[block.type]
    if (!generator)
      throw Error(`No block generator found for block type ${block.type}`)
    return generator(block, this)
  }

  workspaceToExpression(workspace: Workspace): Expression {
    const topBlocks = workspace.getTopBlocks(true)
    const entries: Expression[] = []

    for (const block of topBlocks) {
      const expr = this.blockToExpression(block)
      entries.push(expr)
    }

    // return one single expression and let the expression evaluator handle it
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

export const exprGenerator = new ExpressionGenerator()

/**
 * @todo migrate all generators to use Expression as return
 */
exprGenerator.forValueBlock('math_number', function (block: Block): Expression {
  return {
    type: 'literal',
    value: block.getFieldValue('NUM')
  }
})

exprGenerator.forValueBlock('text', function (block: Block): Expression {
  return {
    type: 'literal',
    value: block.getFieldValue('TEXT')
  }
})

exprGenerator.forValueBlock('input', function (block: Block): Expression {
  const value = block.getFieldValue('VALUE') as Value
  // "input" blocks are text inputs in disguise, this allows for numeric inputs aswell
  const resolved = Number.isNaN(Number(value)) ? value : Number(value)
  return {
    type: 'literal',
    value: resolved
  }
})

// MOTION
exprGenerator.forBlock(
  'moveunitsxyz',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const objectId = block.getFieldValue('OBJECT') as string
    const unitsExpr = generator.getInputValue(block, 'UNITS', 0)
    const direction = block.getFieldValue('DIRECTION') as string
    const axis = direction.slice(-1)

    return {
      type: 'translatexyz',
      args: [
        { type: 'literal', value: objectId },
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
    const objectId = block.getFieldValue('OBJECT') as string
    const axis = block.getFieldValue('AXIS') as string
    const angle = generator.getInputValue(block, 'ANGLE', 0)
    return {
      type: 'rotatexyz',
      args: [
        { type: 'literal', value: objectId },
        { type: 'literal', value: axis },
        angle
      ]
    }
  }
)

exprGenerator.forBlock(
  'translatexyz',
  function (block: Block, generator: ExpressionGenerator): Expression {
    const objectId = block.getFieldValue('OBJECT') as string
    const axis = block.getFieldValue('AXIS') as string
    const distanceExpr = generator.getInputValue(block, 'UNITS', 0)

    return {
      type: 'translatexyz',
      args: [
        { type: 'literal', value: objectId },
        { type: 'literal', value: axis },
        distanceExpr
      ]
    }
  }
)

// EVENTS
exprGenerator.forBlock('onclickrun', function (block: Block): Expression {
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
    const ms = generator.getInputValue(block, 'MS', 0)

    return {
      type: 'wait',
      values: ms,
      resolvers: [Number]
    }
  }
)

exprGenerator.forValueBlock(
  'logic_boolean',
  function (block: Block): ValueWrapper[] {
    const bool = block.getFieldValue('BOOL') as 'TRUE' | 'FALSE'
    return [{ content: bool === 'TRUE' ? true : false }]
  }
)
exprGenerator.forValueBlock(
  'logic_operation',
  function (block: Block, generator: ExpressionGenerator): ValueWrapper[] {
    const operator = block.getFieldValue('OP') as keyof typeof operations
    const a = generator.getInputValue(block, 'A', false)
    const b = generator.getInputValue(block, 'B', false)

    const operations = {
      AND: (a: boolean, b: boolean) => a && b,
      OR: (a: boolean, b: boolean) => a || b
    }

    return [
      {
        compute: operations[operator],
        resolvers: [Boolean, Boolean],
        nestedValues: a.concat(b)
      }
    ]
  }
)

exprGenerator.forValueBlock(
  'logic_negate',
  function (block: Block, generator: ExpressionGenerator): ValueWrapper[] {
    const bool = generator.getInputValue(block, 'BOOL', false)

    return [
      {
        compute: (b: boolean) => !b,
        resolvers: [Boolean],
        nestedValues: bool
      }
    ]
  }
)

exprGenerator.forValueBlock(
  'logic_compare',
  function (block: Block, generator: ExpressionGenerator): ValueWrapper[] {
    const operator = block.getFieldValue('OP') as keyof typeof operations
    const a = generator.getInputValue(block, 'A')
    const b = generator.getInputValue(block, 'B')

    const operations = {
      EQ: (a: Value, b: Value) => a == b,
      NEQ: (a: Value, b: Value) => a != b,
      LT: (a: Value, b: Value) => a < b,
      LTE: (a: Value, b: Value) => a <= b,
      GT: (a: Value, b: Value) => a > b,
      GTE: (a: Value, b: Value) => a >= b
    }

    return [
      {
        compute: operations[operator],
        nestedValues: a.concat(b)
      }
    ]
  }
)

// MATH
exprGenerator.forBlock(
  'math_change',
  function (block: Block, generator: ExpressionGenerator): Action {
    const varId = block.getFieldValue('VAR') as string
    const delta = generator.getInputValue(block, 'DELTA')
    return {
      type: 'changevar',
      fields: [varId],
      values: delta
    }
  }
)

exprGenerator.forValueBlock(
  'math_arithmetic',
  function (block: Block, generator: ExpressionGenerator): ValueWrapper[] {
    const operator = block.getFieldValue('OP') as keyof typeof operations
    const a = generator.getInputValue(block, 'A')
    const b = generator.getInputValue(block, 'B')

    const operations = {
      ADD: (a: number, b: number) => a + b,
      MINUS: (a: number, b: number) => a - b,
      MULTIPLY: (a: number, b: number) => a * b,
      DIVIDE: (a: number, b: number) => a / b,
      POWER: (a: number, b: number) => a ** b
    }

    return [
      {
        compute: operations[operator],
        resolvers: [Number, Number],
        nestedValues: a.concat(b)
      }
    ]
  }
)

exprGenerator.forValueBlock(
  'math_map',
  function (block: Block, generator: ExpressionGenerator): ValueWrapper[] {
    const x = generator.getInputValue(block, 'NUM')
    const fromMin = generator.getInputValue(block, 'FROM_MIN')
    const fromMax = generator.getInputValue(block, 'FROM_MAX')
    const toMin = generator.getInputValue(block, 'TO_MIN')
    const toMax = generator.getInputValue(block, 'TO_MAX')

    function compute(
      x: number,
      a: number,
      b: number,
      c: number,
      d: number
    ): number {
      return ((x - a) / (b - a)) * (d - c) + c
    }

    return [
      {
        compute,
        resolvers: [Number, Number, Number, Number, Number],
        nestedValues: x
          .concat(fromMin)
          .concat(fromMax)
          .concat(toMin)
          .concat(toMax)
      }
    ]
  }
)

exprGenerator.forValueBlock('math_constant', function (block: Block) {
  const constant = block.getFieldValue('CONSTANT') as keyof typeof constants

  const constants = {
    PI: Math.PI,
    E: Math.E,
    GOLDEN_RATIO: (1 + Math.sqrt(5)) / 2,
    SQRT2: Math.SQRT2,
    SQRT1_2: Math.SQRT1_2,
    INFINITY: Infinity
  }

  return [{ content: constants[constant] }]
})

exprGenerator.forValueBlock(
  'math_trig',
  function (block: Block, generator: ExpressionGenerator) {
    const x = generator.getInputValue(block, 'NUM')
    const operator = block.getFieldValue('OP') as keyof typeof operations

    const operations = {
      SIN: (x: number) => Math.sin(x),
      COS: (x: number) => Math.cos(x),
      TAN: (x: number) => Math.tan(x),
      ASIN: (x: number) => Math.asin(x),
      ACOS: (x: number) => Math.acos(x),
      ATAN: (x: number) => Math.atan(x)
    }

    return [
      {
        compute: operations[operator],
        resolvers: [Number],
        nestedValues: x
      }
    ]
  }
)

exprGenerator.forValueBlock(
  'math_htrig',
  function (block: Block, generator: ExpressionGenerator) {
    const x = generator.getInputValue(block, 'NUM')
    const operator = block.getFieldValue('OP') as keyof typeof operations

    const operations = {
      SINH: (x: number) => Math.sinh(x),
      COSH: (x: number) => Math.cosh(x),
      TANH: (x: number) => Math.tanh(x),
      ASINH: (x: number) => Math.asinh(x),
      ACOSH: (x: number) => Math.acosh(x),
      ATANH: (x: number) => Math.atanh(x)
    }

    return [
      {
        compute: operations[operator],
        resolvers: [Number],
        nestedValues: x
      }
    ]
  }
)

exprGenerator.forValueBlock(
  'math_round',
  function (block: Block, generator: ExpressionGenerator) {
    const x = generator.getInputValue(block, 'NUM')
    const operator = block.getFieldValue('OP') as keyof typeof operations

    const operations = {
      ROUND: (x: number) => Math.round(x),
      ROUNDUP: (x: number) => Math.floor(x),
      ROUNDDOWN: (x: number) => Math.ceil(x)
    }

    return [
      {
        compute: operations[operator],
        resolvers: [Number],
        nestedValues: x
      }
    ]
  }
)

exprGenerator.forValueBlock(
  'math_single',
  function (block: Block, generator: ExpressionGenerator) {
    const x = generator.getInputValue(block, 'NUM')
    const operator = block.getFieldValue('OP') as keyof typeof operations

    const operations = {
      ROOT: (x: number) => Math.sqrt(x),
      ABS: (x: number) => Math.abs(x),
      NEG: (x: number) => -x,
      LN: (x: number) => Math.log(x),
      LOG10: (x: number) => Math.log10(x),
      EXP: (x: number) => Math.E ** x,
      POW10: (x: number) => x ** 10
    }

    return [
      {
        compute: operations[operator],
        resolvers: [Number],
        nestedValues: x
      }
    ]
  }
)

exprGenerator.forValueBlock(
  'math_atan2',
  function (block: Block, generator: ExpressionGenerator): ValueWrapper[] {
    const x = generator.getInputValue(block, 'X')
    const y = generator.getInputValue(block, 'Y')

    return [
      {
        compute: (x: number, y: number) => Math.atan2(x, y),
        resolvers: [Number, Number],
        nestedValues: x.concat(y)
      }
    ]
  }
)

exprGenerator.forValueBlock(
  'math_modulo',
  function (block: Block, generator: ExpressionGenerator): ValueWrapper[] {
    const dividend = generator.getInputValue(block, 'DIVIDEND')
    const divisor = generator.getInputValue(block, 'DIVISOR')

    return [
      {
        compute: (x: number, y: number) => x % y,
        resolvers: [Number, Number],
        nestedValues: dividend.concat(divisor)
      }
    ]
  }
)

exprGenerator.forValueBlock(
  'math_constrain',
  function (block: Block, generator: ExpressionGenerator): ValueWrapper[] {
    const value = generator.getInputValue(block, 'VALUE')
    const low = generator.getInputValue(block, 'LOW')
    const high = generator.getInputValue(block, 'HIGH')

    return [
      {
        compute: (x: number, l: number, h: number) =>
          Math.min(Math.max(x, l), h),
        resolvers: [Number, Number, Number],
        nestedValues: value.concat(low).concat(high)
      }
    ]
  }
)

exprGenerator.forValueBlock('math_random_float', function (): ValueWrapper[] {
  return [{ content: Math.random() }]
})

exprGenerator.forValueBlock(
  'math_modulo',
  function (block: Block, generator: ExpressionGenerator): ValueWrapper[] {
    const from = generator.getInputValue(block, 'DIVIDEND')
    const to = generator.getInputValue(block, 'DIVISOR')

    function mathRandomInt(a: number, b: number): number {
      if (a > b) [a, b] = [b, a]
      return Math.floor(Math.random() * (b - a + 1)) + a
    }
    return [
      {
        compute: mathRandomInt,
        resolvers: [Number, Number],
        nestedValues: from.concat(to)
      }
    ]
  }
)

// VARIABLES
exprGenerator.forValueBlock(
  'variables_get',
  function (block: Block): ValueWrapper[] {
    const varId = block.getFieldValue('VAR') as string
    return [{ varId: varId }]
  }
)

exprGenerator.forBlock(
  'variables_set',
  function (block: Block, generator: ExpressionGenerator): Action {
    const varId = block.getFieldValue('VAR') as string
    const value = generator.getInputValue(block, 'VALUE')
    return {
      type: 'setvar',
      fields: [varId],
      values: value
    }
  }
)

// FUNCTIONS
exprGenerator.forBlock(
  'procedures_defnoreturn',
  function (block: Block, generator: ExpressionGenerator): Action {
    const actions: Action[] = generateExprsFromInput(
      block.getInput('STACK'),
      generator
    )
    const name = block.getFieldValue('NAME') as string

    return {
      type: 'procedures_defnoreturn',
      fields: [name],
      actionsList: [actions]
    }
  }
)

exprGenerator.forBlock(
  'procedures_defreturn',
  function (block: Block, generator: ExpressionGenerator): Action {
    const actions: Action[] = generateExprsFromInput(
      block.getInput('STACK'),
      generator
    )
    const name = block.getFieldValue('NAME') as string
    const returnValue = generator.getInputValue(block, 'RETURN', 0)

    return {
      type: 'procedures_defreturn',
      fields: [name],
      values: returnValue,
      actionsList: [actions]
    }
  }
)

exprGenerator.forBlock(
  'procedures_callnoreturn',
  function (block: Block): Action {
    const extraState =
      block.saveExtraState && (block.saveExtraState(true) as { name: string })
    if (!extraState) throw Error('Extrastate does not exist.')

    return {
      type: 'procedures_callnoreturn',
      fields: [extraState.name]
    }
  }
)

exprGenerator.forValueBlock(
  'procedures_callreturn',
  function (block: Block): ValueWrapper[] {
    const extraState =
      block.saveExtraState && (block.saveExtraState(true) as { name: string })
    if (!extraState) throw Error('Extrastate does not exist.')

    return [{ funcName: extraState.name }]
  }
)

// Helper Functions

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
    const objectId = block.getFieldValue('OBJECT') as string
    const xExpr = generator.getInputValue(block, 'X', 0)
    const yExpr = generator.getInputValue(block, 'Y', 0)
    const zExpr = generator.getInputValue(block, 'Z', 0)
    return {
      type,
      args: [
        { type: 'literal', value: objectId },
        xExpr, yExpr, zExpr
      ]
    }
  }
}