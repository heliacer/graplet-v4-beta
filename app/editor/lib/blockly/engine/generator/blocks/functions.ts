import { Block } from 'blockly'
import { ExpressionGenerator, generateExprsFromInput } from '..'
import { Expression } from '../../ast'
import { FunctionExtraState, OldExtraState } from '../../../../types'

/** @deprecated legacy built-in functions */
export function proceduresDefNoReturnGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const exprs: Expression[] = generateExprsFromInput(
    block.getInput('STACK'),
    generator
  )
  const name = block.getFieldValue('NAME') as string

  return {
    type: 'setfunc',
    value: name,
    children: exprs
  }
}

/** @deprecated legacy built-in functions */
export function proceduresDefReturnGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const exprs: Expression[] = generateExprsFromInput(
    block.getInput('STACK'),
    generator
  )
  const name = block.getFieldValue('NAME') as string
  const returnExpr = generator.getInputValue(block, 'RETURN', 0)

  return {
    type: 'setfunc',
    value: name,
    args: [returnExpr],
    children: exprs
  }
}

/** @deprecated legacy built-in functions */
export function proceduresCallNoReturnGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const extraState =
    block.saveExtraState && (block.saveExtraState(true) as OldExtraState)
  if (!extraState) throw Error('Extrastate does not exist.')

  const argsExprs: Expression[] = []
  extraState.params?.forEach((param, i) => {
    const argExpr = generator.getInputValue(block, `ARG${i}`, 0)
    argsExprs.push({
      type: 'setvar',
      value: param,
      args: [argExpr]
    })
  })
  return {
    type: 'call',
    args: argsExprs,
    value: extraState.name
  }
}

/** @deprecated legacy built-in functions */
export function proceduresCallReturnGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const extraState =
    block.saveExtraState && (block.saveExtraState(true) as OldExtraState)
  if (!extraState) throw Error('Extrastate does not exist.')

  const argsExprs: Expression[] = []
  extraState.params?.forEach((param, i) => {
    const argExpr = generator.getInputValue(block, `ARG${i}`, 0)
    argsExprs.push({
      type: 'setvar',
      value: param,
      args: [argExpr]
    })
  })
  return {
    type: 'call',
    args: argsExprs,
    value: extraState.name
  }
}

export function functionDefGen(): Expression {
  return {
    type: 'literal',
    value: 0
  }
}

export function functionCallGen(block: Block): Expression {
  if (block.saveExtraState) {
    const extraState = block.saveExtraState(true) as FunctionExtraState
    console.log(extraState)
  }

  return {
    type: 'literal',
    value: 0
  }
}
