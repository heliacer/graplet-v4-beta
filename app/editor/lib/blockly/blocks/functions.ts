import { Blocks, common } from 'blockly'
import { FunctionExtraState, ProcedureBlock } from '../../types'
import { ObservableProcedureModel } from '@blockly/block-shareable-procedures'

/** @todo (#14) Graplet Procedures */

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
    input.appendField('define')
    input.connection?.setShadowState({
      type: 'function_call'
    })

    this.setNextStatement(true, null)
    this.setStyle('function_blocks')
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
    if (!this.model) return
  },

  saveExtraState(this: ProcedureBlock) {
    return {
      procedureId: this.model?.getId()
    }
  },

  loadExtraState(this: ProcedureBlock, state: FunctionExtraState) {
    const { procedureId } = state

    const workspace = this.workspace
    const model = workspace.getProcedureMap().get(procedureId)
    if (model) {
      this.model = model as ObservableProcedureModel
      const input = this.getInput('DEF')
      const block = input?.connection?.targetBlock() as ProcedureBlock
      block?.loadExtraState?.({ procedureId })
      block.doProcedureUpdate()
      this.doProcedureUpdate()
    }
  },

  destroy(this: ProcedureBlock) {}
}

Blocks['function_call'] = {
  init(this: ProcedureBlock) {
    this.appendDummyInput().appendField('', 'NAME')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setStyle('function_blocks')
    this.model = null
  },

  getProcedureModel(this: ProcedureBlock) {
    return this.model
  },

  isProcedureDef(this: ProcedureBlock) {
    return false
  },

  getVarModels(this: ProcedureBlock) {
    return []
  },

  doProcedureUpdate(this: ProcedureBlock) {
    if (!this.model) return
    this.setFieldValue(this.model.getName(), 'NAME')
  },

  saveExtraState(this: ProcedureBlock) {
    return {
      procedureId: this.model?.getId()
    }
  },

  loadExtraState(this: ProcedureBlock, state: FunctionExtraState) {
    const workspace = this.workspace.targetWorkspace ?? this.workspace
    const model = workspace.getProcedureMap().get(state.procedureId)
    if (model) {
      this.model = model as ObservableProcedureModel
      this.doProcedureUpdate()
    }
  }
}
