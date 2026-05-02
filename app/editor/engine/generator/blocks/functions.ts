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

  return {
    type: 'setfunc',
    value: state.id,
    children: connectedExprs
  }
}

export function functionCallGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const state = block.saveExtraState?.(true) as ProcedureState
  const args: Expression[] = []

  for (let i = 0; i < state.parameters.length; i++) {
    const param = state.parameters[i]
    const type = param.types[0]
    if (type === 'Label') continue
    const defaultValue = type === 'String' ? '?' : type === 'Number' ? 0 : false
    const arg = generator.getInputValue(block, `ARG${i}`, defaultValue)
    args.push({
      type: 'setparam',
      value: `${param.name}-${type}`,
      args: [arg]
    })
  }

  return {
    type: 'call',
    args,
    value: state.id
  }
}

export function functionParamGen(block: Block): Expression {
  const state = block.saveExtraState?.(true) as ProcedureState & {
    index: number
  }
  
  const param = state.parameters[state.index]
  const type = param.types[0]

  return {
    type: 'param',
    value: `${param.name}-${type}`
  }
}
