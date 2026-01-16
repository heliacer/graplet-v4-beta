import { ObservableProcedureModel } from '@blockly/block-shareable-procedures'
import { Blocks, common } from 'blockly'
import { ProcedureBlock } from '../../types'

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
  init: function (this: ProcedureBlock) {
    const input = this.appendStatementInput('DEF')
    this.setNextStatement(true, null)
    this.setStyle('function_blocks')
    this.setOutputShape(10)
    input.appendField('function')
    input.connection?.setShadowState({
      type: 'function_call'
    })

    this.model = new ObservableProcedureModel(this.workspace, 'default name')
    this.workspace.getProcedureMap().add(this.model)
    // etc...
  },

  destroy: function (this: ProcedureBlock) {
    /** Insertion markers reference the model of the original block */
    if (this.isInsertionMarker()) return
    this.workspace.getProcedureMap().delete(this.model.getId())
  },

  getProcedureModel(this: ProcedureBlock) {
    return this.model
  },

  isProcedureDef(this: ProcedureBlock) {
    return true
  },

  getVarModels(this: ProcedureBlock) {
    // If your procedure references variables
    // then you should return those models here.
    return []
  },

  doProcedureUpdate(this: ProcedureBlock) {
    console.log(this.model.getParameters())
  }
}

Blocks['function_call'] = {
  init(this: ProcedureBlock) {
    /** @todo The dummy input will be removed once the function block editor has been added */
    this.appendDummyInput('NAME').appendField('default name')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setStyle('function_blocks')
  },

  getProcedureModel(this: ProcedureBlock) {
    return this.model
  },

  isProcedureDef(this: ProcedureBlock) {
    return false
  },

  getVarModels(this: ProcedureBlock) {
    // If your procedure references variables
    // then you should return those models here.
    return []
  }
}
