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
    this.appendDummyInput().appendField('', 'NAME')
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
    this.setFieldValue(this.model?.getName(), 'NAME')
    if (!this.model) return
  },

  saveExtraState(this: ProcedureBlock, doFullSerialization: boolean) {
    if (!this.model) return

    const state: FunctionExtraState = {
      procedureId: this.model.getId()
    }

    if (doFullSerialization) {
      state.name = this.model.getName()
      state.parameters = this.model.getParameters().map(p => ({
        name: p.getName(),
        id: p.getId()
      }))
    }

    return state
  },

  loadExtraState(this: ProcedureBlock, state: FunctionExtraState) {
    const { procedureId } = state

    const workspace = this.workspace
    const model = workspace.getProcedureMap().get(procedureId)

    if (model) {
      this.model = model as ObservableProcedureModel
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

  saveExtraState(this: ProcedureBlock, doFullSerialization: boolean) {
    if (!this.model) return

    const state: FunctionExtraState = {
      procedureId: this.model.getId()
    }

    if (doFullSerialization) {
      state.name = this.model.getName()
      state.parameters = this.model.getParameters().map(p => ({
        name: p.getName(),
        id: p.getId()
      }))
    }

    return state
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
