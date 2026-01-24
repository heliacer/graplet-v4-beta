import { Block } from 'blockly'
import { exprGenerator } from '.'
import { Expression } from '../ast'

export function onflagclickGen(block: Block): Expression {
  const connectedExprs = exprGenerator.getConnectedExpressions(block)
  return { type: 'runseq', children: connectedExprs }
}
