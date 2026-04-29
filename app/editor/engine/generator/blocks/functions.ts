import { ProcedureState } from '@/app/editor/types'
import { ExpressionGenerator } from '..'
import { Expression } from '../../ast'
import { Block } from 'blockly'

export function functionDefGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const state = block.saveExtraState?.(true) as ProcedureState
  const connectedExprs = generator.getConnectedExpressions(block)
  console.log(state, connectedExprs)

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
  const state = block.saveExtraState?.(true) as ProcedureState
  console.log(state)

  /**
   * @todo get params, filter out labels
   * - do not use state.name
   */

  return {
    type: 'call',
    value: state.id
  }
}
