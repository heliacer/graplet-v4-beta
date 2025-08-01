import { Block, Workspace } from "blockly"
import { Action, ActionScript, IR } from "../types"

class IRGenerator {
  private blockGenerators: Record<string, (block: Block, generator: IRGenerator) => Action | null> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private valueGenerators: Record<string, (block: Block, generator: IRGenerator) => any> = {}
  private triggerBlocks = new Set(['onclickrun'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private variables: Map<string, any> = new Map()
  forBlock(blockType: string, generatorFn: (block: Block, generator: IRGenerator) => Action | null) {
    this.blockGenerators[blockType] = generatorFn
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  forValueBlock(blockType: string, generatorFn: (block: Block, generator: IRGenerator) => any) {
    this.valueGenerators[blockType] = generatorFn
  }
  registerTrigger(blockType: string) {
    this.triggerBlocks.add(blockType)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setVariable(varId: string, value: any): void {
    this.variables.set(varId, value)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getVariable(varId: string): any {
    return this.variables.get(varId) ?? 0
  }
  changeVariable(varId: string, delta: number): void {
    const currentValue = this.getVariable(varId)
    this.setVariable(varId, (Number.isNaN(Number(currentValue)) ? 0 : Number(currentValue)) + delta)
  }
  clearVariables(): void {
    this.variables.clear()
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getInputValue(block: Block, inputName: string): any {
    const input = block.getInput(inputName)
    if (!input || !input.connection) {
      return null
    }
    const connectedBlock = input.connection.targetBlock()
    if (!connectedBlock) {
      return null
    }
    const valueGenerator = this.valueGenerators[connectedBlock.type]
    if (valueGenerator) {
      return valueGenerator(connectedBlock, this)
    }
    console.warn(`No value generator found for block type: ${connectedBlock.type}`)
    return null
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

irGenerator.forBlock('moveunitsxyz', function (block: Block): Action {
  const units = block.getFieldValue('UNITS') as number
  const direction = block.getFieldValue('DIRECTION') as string
  const axis = direction.slice(-1)
  return {
    type: 'translatexyz',
    fields: [axis, direction.startsWith('-') ? -units : units]
  }
})

irGenerator.forBlock('setposxyz', function (block: Block): Action {
  const x = block.getFieldValue('X')
  const y = block.getFieldValue('Y')
  const z = block.getFieldValue('Z')
  return {
    type: 'setposxyz',
    fields: [x, y, z]
  }
})

irGenerator.forBlock('setscalexyz', function (block: Block): Action {
  const x = block.getFieldValue('X')
  const y = block.getFieldValue('Y')
  const z = block.getFieldValue('Z')
  return {
    type: 'setscalexyz',
    fields: [x, y, z]
  }
})

irGenerator.forBlock('setroteulerxyz', function (block: Block): Action {
  const x = block.getFieldValue('X')
  const y = block.getFieldValue('Y')
  const z = block.getFieldValue('Z')
  return {
    type: 'setroteulerxyz',
    fields: [x, y, z]
  }
})

irGenerator.forBlock('rotatexyz', function (block: Block): Action {
  const axis = block.getFieldValue('AXIS')
  const angle = block.getFieldValue('ANGLE')
  return {
    type: 'rotatexyz',
    fields: [axis, angle]
  }
})

irGenerator.forBlock('translatexyz', function (block: Block): Action {
  const axis = block.getFieldValue('AXIS')
  const distance = block.getFieldValue('UNITS')
  return {
    type: 'translatexyz',
    fields: [axis, distance]
  }
})

irGenerator.forBlock('repeat', function (block: Block, generator: IRGenerator): Action {
  const times = generator.getInputValue(block, 'TIMES')
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
    fields: [times],
    children: children
  }
})

irGenerator.forBlock('wait', function (block: Block, generator: IRGenerator): Action {
  const ms = generator.getInputValue(block, 'MS')
  return {
    type: 'wait',
    fields: [ms]
  }
})


irGenerator.forValueBlock('math_number', function (block: Block): number {
  return block.getFieldValue('NUM')
})


irGenerator.forValueBlock('text', function (block: Block): string {
  return block.getFieldValue('TEXT')
})

irGenerator.forValueBlock('input', function (block: Block): string | number {
  const value = block.getFieldValue('VALUE')
  return Number.isNaN(Number(value)) ? value : Number(value)
})


irGenerator.forValueBlock('variables_get', function (block: Block, generator: IRGenerator): any {
  const varId = block.getFieldValue('VAR')
  return generator.getVariable(varId)
})


irGenerator.forBlock('variables_set', function (block: Block, generator: IRGenerator): Action {
  const varId = block.getFieldValue('VAR')
  const value = generator.getInputValue(block, 'VALUE')
  console.log(value)
  generator.setVariable(varId, value)
  return {
    type: 'ignore',
    fields: []
  }
})


irGenerator.forBlock('math_change', function (block: Block, generator: IRGenerator): Action {
  const varId = block.getFieldValue('VAR')
  const delta = generator.getInputValue(block, 'DELTA')
  generator.changeVariable(varId, delta)
  return {
    type: 'ignore',
    fields: []
  }
})


irGenerator.forValueBlock('math_arithmetic', function (block: Block, generator: IRGenerator): number {
  const operator = block.getFieldValue('OP')
  const a = generator.getInputValue(block, 'A')
  const b = generator.getInputValue(block, 'B')
  switch (operator) {
    case 'ADD': return a + b
    case 'MINUS': return a - b
    case 'MULTIPLY': return a * b
    case 'DIVIDE': return a / a
    default: return 0
  }
})
