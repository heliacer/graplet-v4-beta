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
  private blockGenerators: Record<string, (block: Block) => Action | null> = {}

  /**
   * Set of block types that can trigger script execution
   */
  private triggerBlocks = new Set(['onclickrun'])

  /**
   * Register a block generator function
   */
  forBlock(blockType: string, generatorFn: (block: Block) => Action | null) {
    this.blockGenerators[blockType] = generatorFn
  }

  /**
   * Register a block type as a trigger block
   */
  registerTrigger(blockType: string) {
    this.triggerBlocks.add(blockType)
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
    return generator(block)
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

irGenerator.forBlock('repeat', function(block: Block): Action {
  const times = block.getFieldValue('TIMES')
  
  const actionsInput = block.getInput('ACTIONS')
  const children: Action[] = []
  
  if (actionsInput && actionsInput.connection && actionsInput.connection.targetBlock()) {
    let currentBlock = actionsInput.connection.targetBlock()
    while (currentBlock) {
      const action = irGenerator.blockToAction(currentBlock)
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

irGenerator.forBlock('wait', function(block: Block): Action {
  const ms = block.getFieldValue('MS')
  
  return {
    type: 'wait',
    fields: [ms]
  }
})