import { Block, Workspace } from "blockly"
import { Action, ActionScript, IR } from "../types"


/**
 * Custom IR Generator for converting Blockly workspace to Action IR
 * This is different from Blockly's code generators as it produces structured data, not code strings
 */
class IRGenerator {
  /**
   * Block generators - each returns an Action object or null
   */
  private blockGenerators: Record<string, (block: Block, generator: IRGenerator) => Action | null> = {}

  /**
   * Value block generators - each returns a value (string, number, etc.)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private valueGenerators: Record<string, (block: Block, generator: IRGenerator) => any> = {}

  /**
   * Set of block types that can trigger script execution
   */
  private triggerBlocks = new Set(['onclickrun'])

  /**
   * Register a block generator function
   */
  forBlock(blockType: string, generatorFn: (block: Block, generator: IRGenerator) => Action | null) {
    this.blockGenerators[blockType] = generatorFn
  }

  /**
   * Register a value block generator function
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  forValueBlock(blockType: string, generatorFn: (block: Block, generator: IRGenerator) => any) {
    this.valueGenerators[blockType] = generatorFn
  }

  /**
   * Register a block type as a trigger block
   */
  registerTrigger(blockType: string) {
    this.triggerBlocks.add(blockType)
  }

  /**
   * Get the value from a value input connection
   * Similar to Blockly's valueToCode but returns the actual value instead of code string
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueToCode(block: Block, inputName: string): any {
    const input = block.getInput(inputName)
    if (!input || !input.connection) {
      return null
    }

    const connectedBlock = input.connection.targetBlock()
    if (!connectedBlock) {
      return null
    }

    // Check if it's a value block first
    const valueGenerator = this.valueGenerators[connectedBlock.type]
    if (valueGenerator) {
      return valueGenerator(connectedBlock, this)
    }

    // If no value generator found, warn and return null
    console.warn(`No value generator found for block type: ${connectedBlock.type}`)
    return null
  }

  /**
   * Convert a single block to an Action
   */
  blockToAction(block: Block): Action | null {
    const generator = this.blockGenerators[block.type]
    if (!generator) {
      console.warn(`No IR generator found for block type: ${block.type}`)
      return null
    }
    return generator(block, this)
  }

  /**
   * Convert workspace to IR with script structure
   */
  workspaceToIR(workspace: Workspace): IR {
    const topBlocks = workspace.getTopBlocks(true)
    const scripts: ActionScript[] = []

    for (const block of topBlocks) {
      // Only process blocks that are triggers
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

  /**
   * Get actions from blocks connected below the trigger block
   */
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

irGenerator.forBlock('onclickrun', function(): Action {
  return {
    type: 'onclickrun',
    fields: []
  }
})

irGenerator.forBlock('moveunitsxyz', function(block: Block): Action {
  const units = block.getFieldValue('UNITS') as number
  const direction = block.getFieldValue('DIRECTION') as string
  const axis = direction.slice(-1)
  console.log(axis)

  return {
    type: 'translatexyz',
    fields: [axis,direction.startsWith('-') ? -units : units]
  }
})


irGenerator.forBlock('setposxyz', function(block: Block): Action {
  const x = block.getFieldValue('X')
  const y = block.getFieldValue('Y')
  const z = block.getFieldValue('Z')

  return {
    type: 'setposxyz',
    fields: [x,y,z]
  }
})

irGenerator.forBlock('setscalexyz', function(block: Block): Action {
  const x = block.getFieldValue('X')
  const y = block.getFieldValue('Y')
  const z = block.getFieldValue('Z')

  return {
    type: 'setscalexyz',
    fields: [x,y,z]
  }
})

irGenerator.forBlock('setroteulerxyz', function(block: Block): Action {
  const x = block.getFieldValue('X')
  const y = block.getFieldValue('Y')
  const z = block.getFieldValue('Z')

  return {
    type: 'setroteulerxyz',
    fields: [x,y,z]
  }
})

irGenerator.forBlock('rotatexyz', function(block: Block): Action {
  const axis = block.getFieldValue('AXIS')
  const angle = block.getFieldValue('ANGLE')
  
  return {
    type: 'rotatexyz',
    fields: [axis,angle]
  }
})

irGenerator.forBlock('translatexyz', function(block: Block): Action {
  const axis = block.getFieldValue('AXIS')
  const distance = block.getFieldValue('UNITS')
  
  return {
    type: 'translatexyz',
    fields: [axis,distance]
  }
})

irGenerator.forBlock('repeat', function(block: Block, generator: IRGenerator): Action {
  const times = block.getFieldValue('TIMES')
  
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

irGenerator.forBlock('wait', function(block: Block, generator: IRGenerator): Action {
  const ms = generator.valueToCode(block, 'MS')
  
  return {
    type: 'wait',
    fields: [ms]
  }
})

irGenerator.forValueBlock('math_number', function(block: Block): number {
  return block.getFieldValue('NUM')
})