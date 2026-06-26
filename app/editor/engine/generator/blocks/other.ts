import { Block } from 'blockly'
import { Expression } from '../../ast'
import { ExpressionGenerator } from '..'

export function send_notificationGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const title = generator.getInputValue(block, 'TITLE', 'Title')
  const content = generator.getInputValue(block, 'CONTENT', 'Content')
  return { type: 'send_notification', args: [title, content] }
}
