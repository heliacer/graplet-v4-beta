import { ExpressionGenerator } from '..'
import { Expression } from '../../ast'
import { Block } from 'blockly'

export function functionDefGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const state = block.saveExtraState?.(true)
  const connectedExprs = generator.getConnectedExpressions(block)

  return {
    type: 'setfunc',
    value: state.name,
    children: connectedExprs
  }
}

export function functionCallGen(block: Block): Expression {
  const state = block.saveExtraState?.(true)

  return {
    type: 'call',
    value: state.name
  }
}
