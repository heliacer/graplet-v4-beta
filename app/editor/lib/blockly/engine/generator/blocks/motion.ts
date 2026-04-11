import { Block } from 'blockly'
import { Expression } from '../../ast'
import { ExpressionGenerator } from '..'

export function objectGen(block: Block): Expression {
  const objectId = block.getFieldValue('VALUE')
  return {
    type: 'literal',
    value: objectId
  }
}

export function moveunitsxyzGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
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

export function rotatexyzGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const objectExpr = generator.getInputValue(block, 'OBJECT', '')
  const axis = block.getFieldValue('AXIS') as string
  const angle = generator.getInputValue(block, 'ANGLE', 0)
  return {
    type: 'rotatexyz',
    args: [objectExpr, { type: 'literal', value: axis }, angle]
  }
}

export function translatexyzGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const objectExpr = generator.getInputValue(block, 'OBJECT', '')
  const axis = block.getFieldValue('AXIS') as string
  const distanceExpr = generator.getInputValue(block, 'UNITS', 0)

  return {
    type: 'translatexyz',
    args: [objectExpr, { type: 'literal', value: axis }, distanceExpr]
  }
}
