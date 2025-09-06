import { Block, Workspace } from "blockly"
import { Action, ActionScript, IR, Value, ValueWrapper } from "../types"

class IRGenerator {
  private blockGenerators: Record<string, (block: Block, generator: IRGenerator) => Action | null> = {}

  private valueGenerators: Record<string, (block: Block, generator: IRGenerator) => ValueWrapper[]> = {}
  private triggerBlocks = new Set(['onclickrun'])

  forBlock(blockType: string, generatorFn: (block: Block, generator: IRGenerator) => Action | null) {
    this.blockGenerators[blockType] = generatorFn
  }

  forValueBlock(blockType: string, generatorFn: (block: Block, generator: IRGenerator) => ValueWrapper[]) {
    this.valueGenerators[blockType] = generatorFn
  }

  registerTrigger(blockType: string) {
    this.triggerBlocks.add(blockType)
  }

  getInputValue(block: Block, inputName: string): ValueWrapper[] {
    const input = block.getInput(inputName)
    if (!input || !input.connection) {
      return [{}]
    }
    const connectedBlock = input.connection.targetBlock()
    if (!connectedBlock) {
      return [{}]
    }
    const valueGenerator = this.valueGenerators[connectedBlock.type]
    if (valueGenerator) {
      return valueGenerator(connectedBlock, this)
    }
    console.warn(`No value generator found for block type: ${connectedBlock.type}`)
    return [{}]
  }

  blockToAction(block: Block): Action | null {
    const generator = this.blockGenerators[block.type]
    if (!generator) {
      console.warn(`No IR generator found for block type: ${block.type}`)
      return null
    }
    return generator(block, this)
  }

  workspaceToIR(workspace: Workspace): IR {
    const topBlocks = workspace.getTopBlocks(true)
    const scripts: ActionScript[] = []
    for (const block of topBlocks) {
      if (this.triggerBlocks.has(block.type)) {
        const trigger = this.blockToAction(block)
        if (trigger) {
          const actions = this.getConnectedActions(block)
          scripts.push({
            trigger,
            actions
          })
        }
      }
    }
    return { scripts: scripts }
  }
  private getConnectedActions(triggerBlock: Block): Action[] {
    const actions: Action[] = []
    let currentBlock = triggerBlock.getNextBlock()
    while (currentBlock) {
      const action = this.blockToAction(currentBlock)
      if (action) {
        actions.push(action)
      }
      currentBlock = currentBlock.getNextBlock()
    }
    return actions
  }
}

export const irGenerator = new IRGenerator()

irGenerator.forBlock('onclickrun', function (): Action {
  return {
    type: 'onclickrun',
    fields: []
  }
})

irGenerator.forBlock('moveunitsxyz', function (block: Block, generator: IRGenerator): Action {
  const objectId = block.getFieldValue('OBJECT') as string
  const units = generator.getInputValue(block, 'UNITS')
  const direction = block.getFieldValue('DIRECTION') as string
  const axis = direction.slice(-1)
  return {
    type: 'translatexyz',
    fields: [objectId, axis, direction.startsWith('-') ? -1 : 1],
    values: units,
    resolvers: [Number]
  }
})

irGenerator.forBlock('setposxyz', function (block: Block, generator: IRGenerator): Action {
  const objectId = block.getFieldValue('OBJECT') as string
  const x = generator.getInputValue(block, 'X')
  const y = generator.getInputValue(block, 'Y')
  const z = generator.getInputValue(block, 'Z')
  return createXyzAction('setposxyz', objectId, x, y, z)
})

irGenerator.forBlock('setscalexyz', function (block: Block, generator: IRGenerator): Action {
  const objectId = block.getFieldValue('OBJECT') as string
  const x = generator.getInputValue(block, 'X')
  const y = generator.getInputValue(block, 'Y')
  const z = generator.getInputValue(block, 'Z')
  return createXyzAction('setscalexyz', objectId, x, y, z)

})

irGenerator.forBlock('setroteulerxyz', function (block: Block, generator: IRGenerator): Action {
  const objectId = block.getFieldValue('OBJECT') as string
  const x = generator.getInputValue(block, 'X')
  const y = generator.getInputValue(block, 'Y')
  const z = generator.getInputValue(block, 'Z')
  return createXyzAction('setroteulerxyz', objectId, x, y, z)
})

irGenerator.forBlock('rotatexyz', function (block: Block, generator: IRGenerator): Action {
  const objectId = block.getFieldValue('OBJECT') as string
  const axis = block.getFieldValue('AXIS') as string
  const angle = generator.getInputValue(block, 'ANGLE')
  return {
    type: 'rotatexyz',
    fields: [objectId, axis],
    values: angle,
    resolvers: [Number]
  }
})

irGenerator.forBlock('translatexyz', function (block: Block, generator: IRGenerator): Action {
  const objectId = block.getFieldValue('OBJECT') as string
  const axis = block.getFieldValue('AXIS') as string
  const distance = generator.getInputValue(block, 'UNITS')

  return {
    type: 'translatexyz',
    fields: [objectId, axis, 1],
    values: distance,
    resolvers: [Number]
  }
})

irGenerator.forBlock('repeat', function (block: Block, generator: IRGenerator): Action {
  const value = generator.getInputValue(block, 'TIMES')

  const actionsInput = block.getInput('ACTIONS')
  const children: Action[] = []
  if (actionsInput && actionsInput.connection && actionsInput.connection.targetBlock()) {
    let currentBlock = actionsInput.connection.targetBlock()
    while (currentBlock) {
      const action = generator.blockToAction(currentBlock)
      if (action) {
        children.push(action)
      }
      currentBlock = currentBlock.getNextBlock()
    }
  }

  return {
    type: 'repeat',
    values: value,
    resolvers: [Number],
    children: children
  }
})

irGenerator.forBlock('wait', function (block: Block, generator: IRGenerator): Action {
  const ms = generator.getInputValue(block, 'MS')

  return {
    type: 'wait',
    values: ms,
    resolvers: [Number]
  }
})

irGenerator.forValueBlock('math_number', function (block: Block): ValueWrapper[] {
  return [{ content: block.getFieldValue('NUM') }]
})

irGenerator.forValueBlock('text', function (block: Block): ValueWrapper[] {
  return [{ content: block.getFieldValue('TEXT') }]
})

irGenerator.forValueBlock('input', function (block: Block): ValueWrapper[] {
  const value = block.getFieldValue('VALUE') as Value
  return [{ content: Number.isNaN(Number(value)) ? value : Number(value) }]
})

irGenerator.forValueBlock('variables_get', function (block: Block): ValueWrapper[] {
  const varId = block.getFieldValue('VAR') as string
  return [{ id: varId }]
})

irGenerator.forBlock('variables_set', function (block: Block, generator: IRGenerator): Action {
  const varId = block.getFieldValue('VAR') as string
  const value = generator.getInputValue(block, 'VALUE')
  return {
    type: 'setvar',
    fields: [varId],
    values: value
  }
})

irGenerator.forBlock('math_change', function (block: Block, generator: IRGenerator): Action {
  const varId = block.getFieldValue('VAR') as string
  const delta = generator.getInputValue(block, 'DELTA')
  return {
    type: 'changevar',
    fields: [varId],
    values: delta
  }
})

irGenerator.forValueBlock('math_arithmetic', function (block: Block, generator: IRGenerator): ValueWrapper[] {
  const operator = block.getFieldValue('OP') as keyof typeof operations
  const a = generator.getInputValue(block, 'A')
  const b = generator.getInputValue(block, 'B')

  const operations = {
    ADD: (a: number, b: number) => a + b,
    MINUS: (a: number, b: number) => a - b,
    MULTIPLY: (a: number, b: number) => a * b,
    DIVIDE: (a: number, b: number) => a / b,
    POWER: (a: number, b: number) => a ** b
  }

  return [{
    compute: operations[operator],
    resolvers: [Number, Number],
    nestedValues: a.concat(b)
  }]
})

irGenerator.forValueBlock('math_map', function (block: Block, generator: IRGenerator): ValueWrapper[] {
  const x = generator.getInputValue(block, 'NUM')
  const fromMin = generator.getInputValue(block, 'FROM_MIN')
  const fromMax = generator.getInputValue(block, 'FROM_MAX')
  const toMin = generator.getInputValue(block, 'TO_MIN')
  const toMax = generator.getInputValue(block, 'TO_MAX')

  function compute(x: number, a: number, b: number, c: number, d: number): number {
    return (x - a) / (b - a) * (d - c) + c
  }

  return [{
    compute,
    resolvers: [Number, Number, Number, Number, Number],
    nestedValues: x.concat(fromMin).concat(fromMax).concat(toMin).concat(toMax),
  }]
})

irGenerator.forValueBlock('math_constant', function (block: Block) {
  const constant = block.getFieldValue('CONSTANT') as keyof typeof constants

  const constants = {
    PI: Math.PI,
    E: Math.E,
    GOLDEN_RATIO: (1 + Math.sqrt(5)) / 2,
    SQRT2: Math.SQRT2,
    SQRT1_2: Math.SQRT1_2,
    INFINITY: Infinity
  }

  return [{ content: constants[constant] }]
})

irGenerator.forValueBlock('math_trig', function (block: Block, generator: IRGenerator) {
  const x = generator.getInputValue(block, 'NUM')
  const operator = block.getFieldValue('OP') as keyof typeof operations

  const operations = {
    SIN: (x: number) => Math.sin(x),
    COS: (x: number) => Math.cos(x),
    TAN: (x: number) => Math.tan(x),
    ASIN: (x: number) => Math.asin(x),
    ACOS: (x: number) => Math.acos(x),
    ATAN: (x: number) => Math.atan(x),
  }

  return [{
    compute: operations[operator],
    resolvers: [Number],
    nestedValues: x
  }]
})

irGenerator.forValueBlock('math_htrig', function (block: Block, generator: IRGenerator) {
  const x = generator.getInputValue(block, 'NUM')
  const operator = block.getFieldValue('OP') as keyof typeof operations

  const operations = {
    SINH: (x: number) => Math.sinh(x),
    COSH: (x: number) => Math.cosh(x),
    TANH: (x: number) => Math.tanh(x),
    ASINH: (x: number) => Math.asinh(x),
    ACOSH: (x: number) => Math.acosh(x),
    ATANH: (x: number) => Math.atanh(x),
  }

  return [{
    compute: operations[operator],
    resolvers: [Number],
    nestedValues: x
  }]
})

irGenerator.forValueBlock('math_round', function (block: Block, generator: IRGenerator) {
  const x = generator.getInputValue(block, 'NUM')
  const operator = block.getFieldValue('OP') as keyof typeof operations

  const operations = {
    ROUND: (x: number) => Math.round(x),
    ROUNDUP: (x: number) => Math.floor(x),
    ROUNDDOWN: (x: number) => Math.ceil(x),
  }

  return [{
    compute: operations[operator],
    resolvers: [Number],
    nestedValues: x
  }]
})

irGenerator.forValueBlock('math_single', function (block: Block, generator: IRGenerator) {
  const x = generator.getInputValue(block, 'NUM')
  const operator = block.getFieldValue('OP') as keyof typeof operations

  const operations = {
    ROOT: (x: number) => Math.sqrt(x),
    ABS: (x: number) => Math.abs(x),
    NEG: (x: number) => -x,
    LN: (x: number) => Math.log(x),
    LOG10: (x: number) => Math.log10(x),
    EXP: (x: number) => Math.E ** x,
    POW10: (x: number) => x ** 10,
  }

  return [{
    compute: operations[operator],
    resolvers: [Number],
    nestedValues: x
  }]
})

irGenerator.forValueBlock('math_atan2', function (block: Block, generator: IRGenerator): ValueWrapper[] {
  const x = generator.getInputValue(block, 'X')
  const y = generator.getInputValue(block, 'Y')

  return [{
    compute: (x: number, y: number) => Math.atan2(x, y),
    resolvers: [Number, Number],
    nestedValues: x.concat(y)
  }]
})

irGenerator.forValueBlock('math_modulo', function (block: Block, generator: IRGenerator): ValueWrapper[] {
  const dividend = generator.getInputValue(block, 'DIVIDEND')
  const divisor = generator.getInputValue(block, 'DIVISOR')

  return [{
    compute: (x: number, y: number) => x % y,
    resolvers: [Number, Number],
    nestedValues: dividend.concat(divisor)
  }]
})

irGenerator.forValueBlock('math_constrain', function (block: Block, generator: IRGenerator): ValueWrapper[] {
  const value = generator.getInputValue(block, 'VALUE')
  const low = generator.getInputValue(block, 'LOW')
  const high = generator.getInputValue(block, 'HIGH')
  
  return [{
    compute: (x: number, l: number, h: number) => Math.min(Math.max(x, l), h),
    resolvers: [Number, Number, Number],
    nestedValues: value.concat(low).concat(high)
  }]
})

irGenerator.forValueBlock('math_random_float', function (): ValueWrapper[] {
  return [{ content: Math.random() }]
})

irGenerator.forValueBlock('math_modulo', function (block: Block, generator: IRGenerator): ValueWrapper[] {
  const from = generator.getInputValue(block, 'DIVIDEND')
  const to = generator.getInputValue(block, 'DIVISOR')

  function mathRandomInt(a: number, b: number): number {
    if (a > b) [a, b] = [b, a];
    return Math.floor(Math.random() * (b - a + 1)) + a
  }
  return [{
    compute: mathRandomInt,
    resolvers: [Number, Number],
    nestedValues: from.concat(to)
  }]
})

function createXyzAction(type: string, objectId: string, x: ValueWrapper[], y: ValueWrapper[], z: ValueWrapper[]): Action {
  return {
    type,
    fields: [objectId],
    values: x.concat(y).concat(z),
    resolvers: [Number, Number, Number]
  }
}
