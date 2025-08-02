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
  const units = generator.getInputValue(block,'UNITS')
  const direction = block.getFieldValue('DIRECTION') as string
  const axis = direction.slice(-1)
  return {
    type: 'translatexyz',
    fields: [axis, direction.startsWith('-') ? -1: 1 ],
    values: units,
    resolvers: [undefined, undefined, (v) => Number(v) | 0]
  }
})

irGenerator.forBlock('setposxyz', function (block: Block, generator: IRGenerator): Action {
  const x = generator.getInputValue(block,'X')
  const y = generator.getInputValue(block,'Y')
  const z = generator.getInputValue(block,'Z')
  return {
    type: 'setposxyz',
    values: x.concat(y).concat(z),
    resolvers: Array(3).fill((v: Value) => Number(v) | 0) 
  }
})

irGenerator.forBlock('setscalexyz', function (block: Block, generator: IRGenerator): Action {
  const x = generator.getInputValue(block,'X')
  const y = generator.getInputValue(block,'Y')
  const z = generator.getInputValue(block,'Z')
  return {
    type: 'setscalexyz',
    values: x.concat(y).concat(z),
    resolvers: Array(3).fill((v: Value) => Number(v) | 0) 
  }
})

irGenerator.forBlock('setroteulerxyz', function (block: Block, generator: IRGenerator): Action {
  const x = generator.getInputValue(block,'X')
  const y = generator.getInputValue(block,'Y')
  const z = generator.getInputValue(block,'Z')
  return {
    type: 'setroteulerxyz',
    values: x.concat(y).concat(z),
    resolvers: Array(3).fill((v: Value) => Number(v) | 0) 
  }
})

irGenerator.forBlock('rotatexyz', function (block: Block, generator: IRGenerator): Action {
  const axis = block.getFieldValue('AXIS') as string
  const angle = generator.getInputValue(block,'ANGLE')
  return {
    type: 'rotatexyz',
    fields: [axis],
    values: angle,
    resolvers: [(v) => Number(v) | 0]
  }
})

irGenerator.forBlock('translatexyz', function (block: Block, generator: IRGenerator): Action {
  const axis = block.getFieldValue('AXIS') as string
  const distance = generator.getInputValue(block,'UNITS')
  return {
    type: 'translatexyz',
    fields: [axis,1],
    values: distance,
    resolvers: [(v) => Number(v) | 0]
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
    resolvers: [(v) => (Number(v) | 0)],
    children: children
  }
})

irGenerator.forBlock('wait', function (block: Block, generator: IRGenerator): Action {
  const ms = generator.getInputValue(block, 'MS')

  return {
    type: 'wait',
    values: ms,
    resolvers: [(v) => (Number(v) | 0)]
  }
})

irGenerator.forValueBlock('math_number', function (block: Block): ValueWrapper[] {
  return [{ content: block.getFieldValue('NUM') }]
})

irGenerator.forValueBlock('text', function (block: Block): ValueWrapper[] {
  return [{ content: block.getFieldValue('TEXT') }]
})

irGenerator.forValueBlock('input', function (block: Block): ValueWrapper[] {
  const value = block.getFieldValue('VALUE')
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
  const operator = block.getFieldValue('OP') as string
  const valueA = generator.getInputValue(block, 'A')
  const valueB = generator.getInputValue(block, 'B')

  const a = (typeof valueA === 'number' ? valueA : 0)
  const b = (typeof valueB === 'number' ? valueB : 0)

  function result() {
    switch (operator) {
      case 'ADD': return a + b
      case 'MINUS': return a - b
      case 'MULTIPLY': return a * b
      case 'DIVIDE': return a / a
      default: return 0
    }
  }

  return [{ content: result() }]
})
