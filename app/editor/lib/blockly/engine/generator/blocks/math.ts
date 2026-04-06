import { Block } from 'blockly'
import { ExpressionGenerator } from '..'
import { Expression } from '../../ast'

export function mathChangeGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const varId = block.getFieldValue('VAR') as string
  const variable = block.workspace.getVariableMap().getVariableById(varId)
  const deltaExpr = generator.getInputValue(block, 'DELTA', 0)
  return {
    type: 'changevar',
    value: variable?.getName(),
    args: [deltaExpr]
  }
}

export function mathArithmeticGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const operator = block.getFieldValue('OP')
  const aExpr = generator.getInputValue(block, 'A', 0)
  const bExpr = generator.getInputValue(block, 'B', 0)

  return {
    type: 'arithmetic',
    value: operator,
    args: [aExpr, bExpr]
  }
}

export function mathMapGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
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

export function mathConstantGen(block: Block): Expression {
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
}

export function mathTrigGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const xExpr = generator.getInputValue(block, 'NUM', 0)
  const operator = block.getFieldValue('OP')

  return {
    type: 'trig',
    value: operator,
    args: [xExpr]
  }
}

export function mathHTrigGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const xExpr = generator.getInputValue(block, 'NUM', 0)
  const operator = block.getFieldValue('OP')

  return {
    type: 'htrig',
    value: operator,
    args: [xExpr]
  }
}

export function mathRoundGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const xExpr = generator.getInputValue(block, 'NUM', 0)
  const operator = block.getFieldValue('OP')

  return {
    type: 'round',
    value: operator,
    args: [xExpr]
  }
}

export function mathSingleGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const xExpr = generator.getInputValue(block, 'NUM', 0)
  const operator = block.getFieldValue('OP')

  return {
    type: 'single',
    value: operator,
    args: [xExpr]
  }
}

export function mathAtan2Gen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const xExpr = generator.getInputValue(block, 'X', 0)
  const yExpr = generator.getInputValue(block, 'Y', 0)

  return {
    type: 'atan2',
    args: [xExpr, yExpr]
  }
}

export function mathModuloGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const dividendExpr = generator.getInputValue(block, 'DIVIDEND', 0)
  const divisorExpr = generator.getInputValue(block, 'DIVISOR', 0)

  return {
    type: 'modulo',
    args: [dividendExpr, divisorExpr]
  }
}

export function mathConstrainGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const valueExpr = generator.getInputValue(block, 'VALUE', 0)
  const lowExpr = generator.getInputValue(block, 'LOW', 0)
  const highExpr = generator.getInputValue(block, 'HIGH', 0)

  return {
    type: 'constrain',
    args: [valueExpr, lowExpr, highExpr]
  }
}

export function mathRandomFloatGen(): Expression {
  return {
    type: 'randomfloat'
  }
}

export function mathRandomIntGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const fromExpr = generator.getInputValue(block, 'FROM', 0)
  const toExpr = generator.getInputValue(block, 'TO', 0)

  return {
    type: 'randomint',
    args: [fromExpr, toExpr]
  }
}
