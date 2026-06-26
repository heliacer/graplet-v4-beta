import { Block, Input, Workspace } from 'blockly'
import { Value, Expression, ExpressionT } from '../ast'
import { onflagclickGen } from './blocks/events'
import {
  moveunitsxyzGen,
  objectGen,
  objectvec3propGen,
  rotatexyzGen,
  translatexyzGen
} from './blocks/motion'
import {
  controlsIfElseGen,
  controlsIfGen,
  logicBooleanGen,
  logicCompareGen,
  logicNegateGen,
  logicOperationGen,
  repeatGen,
  waitGen
} from './blocks/logic'
import {
  mathArithmeticGen,
  mathAtan2Gen,
  mathChangeGen,
  mathConstantGen,
  mathConstrainGen,
  mathHTrigGen,
  mathMapGen,
  mathModuloGen,
  mathRandomFloatGen,
  mathRandomIntGen,
  mathRoundGen,
  mathSingleGen,
  mathTrigGen
} from './blocks/math'
import { variablesGetGen, variablesSetGen } from './blocks/variables'
import {
  functionCallGen,
  functionDefGen,
  functionParamGen
} from './blocks/functions'
import {
  send_notificationGen
} from './blocks/other'

export class ExpressionGenerator {
  private generators: Record<
    string,
    (block: Block, generator: ExpressionGenerator) => Expression
  > = {}

  forBlock(
    blockType: string,
    generatorFn: (block: Block, generator: ExpressionGenerator) => Expression
  ) {
    this.generators[blockType] = generatorFn
  }

  getInputValue(
    block: Block,
    inputName: string,
    defaultValue: Value
  ): Expression {
    const input = block.getInput(inputName)
    if (!input || !input.connection)
      throw Error(`Block input ${inputName} was not found`)

    const connectedBlock = input.connection.targetBlock()
    if (!connectedBlock) {
      return {
        type: 'literal',
        value: defaultValue
      }
    }

    const generator = this.generators[connectedBlock.type]
    if (!generator)
      throw Error(`No generator found for block type ${connectedBlock.type}`)
    return generator(connectedBlock, this)
  }

  blockToExpression(block: Block): Expression {
    const generator = this.generators[block.type]
    if (!generator)
      throw Error(`No generator found for block type ${block.type}`)
    return generator(block, this)
  }

  workspaceToExpression(workspace: Workspace): Expression {
    const topBlocks = workspace.getTopBlocks(true)
    const entries = topBlocks.map(block => this.blockToExpression(block))

    return {
      type: 'main',
      children: entries
    }
  }

  getConnectedExpressions(triggerBlock: Block): Expression[] {
    const exprs: Expression[] = []
    let currentBlock = triggerBlock.getNextBlock()
    while (currentBlock) {
      const expression = this.blockToExpression(currentBlock)
      exprs.push(expression)
      currentBlock = currentBlock.getNextBlock()
    }
    return exprs
  }
}

export const exprGenerator = new ExpressionGenerator()

/** 
 * @todo (#76) Create Variable Editor
 * @deprecated kept for backwards compatibility until
 * custom variable category is added
 */
exprGenerator.forBlock('math_number', function (block: Block): Expression {
  return {
    type: 'literal',
    value: block.getFieldValue('NUM')
  }
})

exprGenerator.forBlock('number', function (block: Block): Expression {
  return {
    type: 'literal',
    value: block.getFieldValue('NUM')
  }
})

exprGenerator.forBlock('string', function (block: Block): Expression {
  const value = block.getFieldValue('VALUE') as Value

  const resolved = Number.isNaN(Number(value)) ? value : Number(value)
  return {
    type: 'literal',
    value: resolved
  }
})

exprGenerator.forBlock('literal_string', function (block: Block): Expression {
  const value = block.getFieldValue('VALUE') as Value

  return {
    type: 'literal',
    value: value
  }
})

/** Events */
exprGenerator.forBlock('onflagclick', onflagclickGen)

/** Motion */
exprGenerator.forBlock('object', objectGen)
exprGenerator.forBlock('objectvec3prop', objectvec3propGen)
exprGenerator.forBlock('moveunitsxyz', moveunitsxyzGen)
exprGenerator.forBlock('setposxyz', createXYZExpr('setposxyz'))
exprGenerator.forBlock('setscalexyz', createXYZExpr('setscalexyz'))
exprGenerator.forBlock('setroteulerxyz', createXYZExpr('setroteulerxyz'))
exprGenerator.forBlock('rotatexyz', rotatexyzGen)
exprGenerator.forBlock('translatexyz', translatexyzGen)

/** Logic */
exprGenerator.forBlock('repeat', repeatGen)
exprGenerator.forBlock('controls_if', controlsIfGen)
exprGenerator.forBlock('controls_ifelse', controlsIfElseGen)
exprGenerator.forBlock('wait', waitGen)
exprGenerator.forBlock('logic_boolean', logicBooleanGen)
exprGenerator.forBlock('logic_operation', logicOperationGen)
exprGenerator.forBlock('logic_negate', logicNegateGen)
exprGenerator.forBlock('logic_compare', logicCompareGen)
exprGenerator.forBlock('math_change', mathChangeGen)
exprGenerator.forBlock('math_arithmetic', mathArithmeticGen)
exprGenerator.forBlock('math_map', mathMapGen)
exprGenerator.forBlock('math_constant', mathConstantGen)
exprGenerator.forBlock('math_trig', mathTrigGen)
exprGenerator.forBlock('math_htrig', mathHTrigGen)
exprGenerator.forBlock('math_round', mathRoundGen)
exprGenerator.forBlock('math_single', mathSingleGen)
exprGenerator.forBlock('math_atan2', mathAtan2Gen)
exprGenerator.forBlock('math_modulo', mathModuloGen)
exprGenerator.forBlock('math_constrain', mathConstrainGen)
exprGenerator.forBlock('math_random_float', mathRandomFloatGen)
exprGenerator.forBlock('math_random_int', mathRandomIntGen)

/** Variables */
exprGenerator.forBlock('variables_get', variablesGetGen)
exprGenerator.forBlock('variables_set', variablesSetGen)

/** Functions */
exprGenerator.forBlock('function_def', functionDefGen)
exprGenerator.forBlock('function_call', functionCallGen)
exprGenerator.forBlock('function_param', functionParamGen)

/** Other */
exprGenerator.forBlock('send_notification', send_notificationGen)

export function generateExprsFromInput(
  input: Input | null,
  generator: ExpressionGenerator
): Expression[] {
  const exprs: Expression[] = []
  if (input?.connection?.targetBlock()) {
    let currentBlock = input.connection.targetBlock()
    while (currentBlock) {
      const action = generator.blockToExpression(currentBlock)
      if (action) {
        exprs.push(action)
      }
      currentBlock = currentBlock.getNextBlock()
    }
  }
  return exprs
}

export function createXYZExpr(type: ExpressionT) {
  return function (block: Block, generator: ExpressionGenerator): Expression {
    const objectExpr = generator.getInputValue(block, 'OBJECT', '')
    const xExpr = generator.getInputValue(block, 'X', 0)
    const yExpr = generator.getInputValue(block, 'Y', 0)
    const zExpr = generator.getInputValue(block, 'Z', 0)
    return {
      type,
      args: [objectExpr, xExpr, yExpr, zExpr]
    }
  }
}
