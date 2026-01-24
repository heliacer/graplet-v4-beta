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

    this.model = new ObservableProcedureModel(this.workspace, 'default name')
    const map = this.workspace.getProcedureMap()
    console.log(map)
    map.add(this.model)

    input.appendField('function')
    input.connection?.setShadowState({
      type: 'function_call'
    })

    // etc...
  },

  destroy: function (this: ProcedureBlock) {
    console.log('def (destroy)')
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
    console.groupCollapsed('def (doProcedureUpdate)')

    const name = model.getName()

    console.log('parameters', model.getParameters())
    console.log('name', name)

    this.getField('NAME')?.setValue(name)
    this.getField('ID')?.setValue(model.getId())

    console.groupEnd()
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

    console.groupCollapsed('def (loadExtraState)')
    console.log('state', state)

    const map = this.workspace.getProcedureMap()
    const model = map.get(procedureId)

    if (model && model instanceof ObservableProcedureModel && !createNewModel) {
      console.log('model extraState [true]', model)

      map.delete(this.model.getId())
      this.model = model
      console.groupEnd()
    } else {
      console.log('model extraState [false]', model)
      console.log('model this', this.model)

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

      console.groupEnd()
      this.doProcedureUpdate()
    }
  }
}

Blocks['function_call'] = {
  init(this: ProcedureBlock) {
    this.appendDummyInput().appendField('', 'NAME')
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
  },

  doProcedureUpdate(this: ProcedureBlock) {
    const model = this.model
    console.groupCollapsed('call (doProcedureUpdate)')
    const field = this.getField('NAME')
    if (model) {
      console.log('model [true]', model)
      field?.setValue(model.getName())
    } else {
      console.warn('model [false]', model)
      field?.setValue('(no model) this.model, call')
    }
    console.groupEnd()
  },

  saveExtraState(this: ProcedureBlock) /* FunctionExtraState */ {
    console.groupCollapsed('call (saveExtraState)')
    const model = this.model
    if (model) {
      console.log('model [true]', model)
      const state: FunctionExtraState = {
        procedureId: model.getId()
      }
      console.groupEnd()
      return state
    } else {
      console.warn('model [false]', model)
      console.groupEnd()
    }
  },

  loadExtraState(this: ProcedureBlock, state: FunctionExtraState) {
    const { procedureId } = state

    console.groupCollapsed('call (loadExtraState)')
    console.log('state', state)
    console.log('model', this.model)
    console.log('block', this)

    const map = this.workspace.getProcedureMap()
    const model = map.get(procedureId)

    if (model && model instanceof ObservableProcedureModel) {
      console.log('model [true]', model)
      this.model = model
    } else {
      console.warn('model [false]', model)
    }

    console.groupEnd()

    this.doProcedureUpdate()
  }
}
