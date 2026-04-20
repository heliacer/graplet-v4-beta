import { Block } from 'blockly'
import { ExpressionGenerator } from '..'
import { Expression } from '../../ast'

export function onflagclickGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const connectedExprs = generator.getConnectedExpressions(block)
  return { type: 'runseq', children: connectedExprs }
}
