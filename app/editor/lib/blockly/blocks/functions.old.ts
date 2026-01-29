import {
  ObservableParameterModel,
  ObservableProcedureModel
} from '@blockly/block-shareable-procedures'
import { Blocks, common } from 'blockly'
import { FunctionExtraState, ProcedureBlock } from '../../types'

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

    // temp
    this.appendDummyInput('TEST')
      .appendField('-', 'NAME')
      .appendField('-', 'ID')

    this.setNextStatement(true, null)
    this.setStyle('function_blocks')
    this.setOutputShape(10)

    if (!this.isInFlyout) {
      this.model = new ObservableProcedureModel(this.workspace, 'default name')
      this.workspace.getProcedureMap().add(this.model)
    }

    input.appendField('function')
    input.connection?.setShadowState({
      type: 'function_call',
      extraState: this.model ? { procedureId: this.model.getId() } : undefined
    })

    // etc...
    console.log(...createLogs(this, 'init', 'aquamarine'))
  },

  destroy: function (this: ProcedureBlock) {
    if (this.isInsertionMarker() || !this.model) return
    this.workspace.getProcedureMap().delete(this.model.getId())
    console.log(...createLogs(this, 'destroy', 'crimson'))
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
    // temp
    if (this.model) {
      this.getField('NAME')?.setValue(this.model.getName())
      this.getField('ID')?.setValue(this.model.getId())
    }

    const input = this.getInput('DEF')
    input?.connection?.setShadowState({
      type: 'function_call',
      extraState: this.model ? { procedureId: this.model.getId() } : undefined
    })

    console.log(...createLogs(this, 'doProcedureUpdate'))
  },

  saveExtraState(
    this: ProcedureBlock,
    doFullSerialization: boolean
  ): FunctionExtraState | void {
    if (!this.model) return
    const state: FunctionExtraState = { procedureId: this.model.getId() }

    if (doFullSerialization) {
      state.name = this.model.getName()
      state.parameters = this.model.getParameters().map(p => {
        return { name: p.getName(), id: p.getId() }
      })
      state.returnTypes = this.model.getReturnTypes()
      state.createNewModel = true
    }

    return state
  },

  loadExtraState(this: ProcedureBlock, state?: FunctionExtraState) {
    if (!state) return
    if (this.isInFlyout) return

    const { procedureId, name, returnTypes, parameters } = state
    const map = this.workspace.getProcedureMap()

    let model = map.get(procedureId) as ObservableProcedureModel

    if (!model) {
      // duplication / load path
      model = new ObservableProcedureModel(
        this.workspace,
        name ?? 'default name',
        procedureId
      )
      map.add(model)
    }

    this.model = model

    if (returnTypes) model.setReturnTypes(returnTypes)

    if (parameters) {
      for (const [i, { name, id }] of parameters.entries()) {
        model.insertParameter(
          new ObservableParameterModel(this.workspace, name, id),
          i
        )
      }
    }

    this.doProcedureUpdate()
    console.log(...createLogs(this, 'loadExtraState', 'hotpink', state))
  }
}

/**
 * all procedure map logs are showing some different map other than the functionCategory list
 * possible hypothesis: there could be a create-delete cycle
 */

Blocks['function_call'] = {
  init(this: ProcedureBlock) {
    this.appendDummyInput().appendField('', 'NAME')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setStyle('function_blocks')
    console.log(...createLogs(this, 'init', 'aquamarine'))
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

  saveExtraState(
    this: ProcedureBlock
  ) /* FunctionExtraState (should not return undefined) */ {
    const model = this.model
    if (model) {
      const state: FunctionExtraState = {
        procedureId: model.getId()
      }
      return state
    }
  },

  destroy: function (this: ProcedureBlock) {
    console.log(...createLogs(this, 'destroy', 'crimson'))
  },

  loadExtraState(this: ProcedureBlock, state: FunctionExtraState) {
    const { procedureId } = state

    const model = this.workspace.getProcedureMap().get(procedureId)

    console.log(...createLogs(this, 'loadExtraState', 'hotpink', state))

    if (model && model instanceof ObservableProcedureModel) {
      this.model = model
    }

    this.doProcedureUpdate()
  }
}
