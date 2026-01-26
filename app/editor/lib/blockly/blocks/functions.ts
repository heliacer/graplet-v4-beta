import {
  ObservableParameterModel,
  ObservableProcedureModel
} from '@blockly/block-shareable-procedures'
import { Blocks, common } from 'blockly'
import { FunctionExtraState, ProcedureBlock } from '../../types'

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

    /** @todo */
    this.appendDummyInput('TEST')
      .appendField('-', 'NAME')
      .appendField('-', 'ID')

    this.setNextStatement(true, null)
    this.setStyle('function_blocks')
    this.setOutputShape(10)

    if (!this.model) {
      this.model = new ObservableProcedureModel(this.workspace, 'default name')
      this.workspace.getProcedureMap().add(this.model)
    }
    console.log(
      '%cDEF [init]',
      'color: lightgreen;',
      this.workspace.getProcedureMap(),
      this.svgGroup
    )

    input.appendField('function')
    input.connection?.setShadowState({
      type: 'function_call',
      extraState: {
        procedureId: this.model.getId()
      }
    })

    // etc...
  },

  destroy: function (this: ProcedureBlock) {
    console.log('%cDEF [destroy]', 'color: red;', this.model.getId())
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
    const model = this.model

    const name = model.getName()

    this.getField('NAME')?.setValue(name)
    this.getField('ID')?.setValue(model.getId())

    const input = this.getInput('DEF')
    console.log(
      'DEF [doProcedureUpdate] updating input connection',
      model.getId()
    )
    input?.connection?.setShadowState({
      type: 'function_call',
      extraState: {
        procedureId: model.getId()
      }
    })
  },

  saveExtraState(
    this: ProcedureBlock,
    doFullSerialization: boolean
  ): FunctionExtraState {
    const model = this.model
    const state: FunctionExtraState = { procedureId: model.getId() }

    if (doFullSerialization) {
      state.name = model.getName()
      state.parameters = model.getParameters().map(p => {
        return { name: p.getName(), id: p.getId() }
      })
      state.returnTypes = model.getReturnTypes()
      state.createNewModel = true
    }

    return state
  },

  loadExtraState(this: ProcedureBlock, state: FunctionExtraState) {
    const { procedureId, name, returnTypes, parameters, createNewModel } = state

    const model = this.workspace.getProcedureMap().get(procedureId)

    console.log(
      'DEF [loadExtraState]',
      state.procedureId,
      model ? 'use as new model' : `use existing model ${this.model.getId()}`
    )

    if (model && model instanceof ObservableProcedureModel && !createNewModel) {
      this.workspace.getProcedureMap().delete(this.model.getId())
      this.model = model
    } else {
      if (name) this.model.setName(name)
      if (returnTypes) this.model.setReturnTypes(returnTypes)
      if (parameters) {
        for (const [i, { name, id }] of parameters.entries()) {
          this.model.insertParameter(
            new ObservableParameterModel(this.workspace, name, id),
            i
          )
        }
      }
    }
    this.doProcedureUpdate()
  }
}

/**
 * all procedure map logs are showing something else than the functionCategory list
 * -> yet they still sync up. like we have a completely different copy
 */

Blocks['function_call'] = {
  init(this: ProcedureBlock) {
    this.appendDummyInput().appendField('', 'NAME')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setStyle('function_blocks')
    console.log(
      '%cCALL [init]',
      'color: lightgreen;',
      this.workspace.getProcedureMap(),
      this.svgGroup
    )
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
  },

  doProcedureUpdate(this: ProcedureBlock) {
    const model = this.model
    const field = this.getField('NAME')
    if (model) {
      field?.setValue(model.getName())
    } else {
      field?.setValue('(no model)')
    }
  },

  saveExtraState(this: ProcedureBlock) /* FunctionExtraState */ {
    const model = this.model
    if (model) {
      const state: FunctionExtraState = {
        procedureId: model.getId()
      }
      return state
    }
  },

  destroy: function (this: ProcedureBlock) {
    console.log('%cCALL [destroy]', 'color: red;')
  },

  loadExtraState(this: ProcedureBlock, state: FunctionExtraState) {
    const { procedureId } = state

    const model = this.workspace.getProcedureMap().get(procedureId)

    console.log(
      'CALL [loadExtraState]',
      state.procedureId,
      model,
      this.svgGroup
    )

    if (model && model instanceof ObservableProcedureModel) {
      this.model = model
    }

    this.doProcedureUpdate()
  }
}
