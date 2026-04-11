import { Block } from 'blockly'
import { ExpressionGenerator } from '..'
import { Expression } from '../../ast'

export function variablesGetGen(block: Block): Expression {
  const varId = block.getFieldValue('VAR') as string
  const variable = block.workspace.getVariableMap().getVariableById(varId)
  return {
    type: 'var',
    value: variable?.getName()
  }
}

export function variablesSetGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const varId = block.getFieldValue('VAR') as string
  const variable = block.workspace.getVariableMap().getVariableById(varId)

  const valueExpr = generator.getInputValue(block, 'VALUE', 0)
  return {
    type: 'setvar',
    value: variable?.getName(),
    args: [valueExpr]
  }
}
