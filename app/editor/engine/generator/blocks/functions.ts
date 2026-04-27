import { ExpressionGenerator } from '..'
import { Expression } from '../../ast'
import { Block } from 'blockly'

export function functionDefGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const state = block.saveExtraState?.()
  const connectedExprs = generator.getConnectedExpressions(block)

  /**
   * @todo get params, filter out labels
   * - do not use state.name
   */

  return {
    type: 'setfunc',
    value: state.id,
    children: connectedExprs
  }
}

export function functionCallGen(block: Block): Expression {
  const state = block.saveExtraState?.()

  /**
   * @todo get params, filter out labels
   * - do not use state.name
   */

  return {
    type: 'call',
    value: state.id
  }
}
