import { Blocks, common } from 'blockly'
import { ProcedureBlock } from '../../types'
import { FunctionEditorIcon } from '../extensions/functionEditorIcon'

/** 
 * @todo finally get a hold of this shit with observable procedure models

  function createLogs(
    block: ProcedureBlock,
    functionName: string,
    color: string = 'aliceblue',
    extraState?: FunctionExtraState
  ) {
    const logs = {
      id: block.id,
      type: block.type,
      isInFlyout: block.isInFlyout,
      isShadow: block.isShadow(),
      procedureMap: Array.from(block.workspace.getProcedureMap().values(), v =>
        v.getId()
      ),
      extraState,
      ...(block.model && {
        model: {
          id: block.model.getId(),
          name: block.model.getName()
        }
      })
    }

    return [`%c[${block.type}:${functionName}]`, `color: ${color};`, logs]
  }
 */
const functionBlocks = common.createBlockDefinitionsFromJsonArray([
  {
    type: 'function_return',
    message0: 'return %1',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE'
      }
    ],
    previousStatement: null,
    style: 'function_blocks'
  }
])

common.defineBlocks(functionBlocks)

Blocks['function_def'] = {
  init(this: ProcedureBlock) {
    const input = this.appendStatementInput('DEF')
    input.appendField('function')
    input.connection?.setShadowState({
      type: 'function_call' // preview of the block (similar to mit's scratch!)
    })

    this.setNextStatement(true, null)
    this.setStyle('function_blocks')
    this.addIcon(new FunctionEditorIcon(this))

    // console.log(...createLogs(this, 'init', 'aquamarine'))
  },

  getProcedureModel(this: ProcedureBlock) {
    return this.model
  },

  isProcedureDef(this: ProcedureBlock) {
    return true
  },

  getVarModels(this: ProcedureBlock) {
    return []
  },

  doProcedureUpdate(this: ProcedureBlock) {
    // console.log(...createLogs(this, 'doProcedureUpdate'))
  },

  saveExtraState(this: ProcedureBlock) {
    // console.log(...createLogs(this, 'saveExtraState'))
  },

  loadExtraState(this: ProcedureBlock /* state: FunctionExtraState */) {
    // console.log(...createLogs(this, 'loadExtraState', 'hotpink', state))
  },

  destroy(this: ProcedureBlock) {
    // console.log(...createLogs(this, 'destroy', 'crimson'))
  }
}

Blocks['function_call'] = {
  init(this: ProcedureBlock) {
    this.appendDummyInput().appendField('do something', 'NAME')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setStyle('function_blocks')

    // console.log(...createLogs(this, 'init', 'aquamarine'))
  },

  getProcedureModel(this: ProcedureBlock) {
    return this.model
  },

  isProcedureDef(this: ProcedureBlock) {
    return false
  },

  getVarModels(this: ProcedureBlock) {
    // console.log(...createLogs(this, 'getVarModels'))
    return []
  },

  doProcedureUpdate(this: ProcedureBlock) {
    // console.log(...createLogs(this, 'doProcedureUpdate'))
  },

  saveExtraState(this: ProcedureBlock) {
    // console.log(...createLogs(this, 'saveExtraState'))
  },

  loadExtraState(this: ProcedureBlock /* state: FunctionExtraState */) {
    // console.log(...createLogs(this, 'loadExtraState', 'hotpink', state))
  }
}
