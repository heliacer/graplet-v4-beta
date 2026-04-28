import { Blocks, common } from 'blockly'
import { ProcedureBlock } from '../../types'
import { ProcedureModel } from '../models/procedure'

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
    if (!this.model) return
    this.setFieldValue(this.model.getId(), 'NAME')
    /** @todo get all params here */
  },

  saveExtraState(this: ProcedureBlock, doFullSerialization?: boolean) {
    if (!this.model) return
    if (!doFullSerialization) return { id: this.model.getId() }
    return {
      id: this.model.getId(),
      parameters: this.model.getParameters().map(p => ({
        name: p.getName(),
        id: p.getId(),
        type: p.getTypes()[0]
      })),
      returnTypes: this.model.getReturnTypes()
    }
  },

  loadExtraState(this: ProcedureBlock, state: { id: string }) {
    const workspace = this.workspace
    const model = workspace.getProcedureMap().get(state.id)
    if (model) {
      this.model = model as ProcedureModel
      this.doProcedureUpdate()
    }
  },

  destroy(this: ProcedureBlock) {}
}

Blocks['function_call'] = {
  init(this: ProcedureBlock) {
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setStyle('function_blocks')
    this.setInputsInline(true)
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
    for (const input of this.inputList) {
      this.removeInput(input.name)
    }
    const params = this.model.getParameters()

    /** @todo needs improvement */
    let labelList: string[] = []
    for (let i = 0; i < params.length; i++) {
      const [type] = params[i].getTypes()
      const name = params[i].getName()
      const inputName = `ARG${i}`
      switch (type) {
        case 'label': {
          if (i === params.length - 1) {
            this.appendDummyInput(inputName).appendField(name)
          } else {
            labelList.push(name)
          }
          break
        }
        case 'bool': {
          const input = this.appendValueInput(inputName)
          input.setCheck('Boolean')
          if (labelList.length > 0) {
            input.appendField(labelList.join(' '))
            labelList = []
          }
          break
        }
        case 'number': {
          const input = this.appendValueInput(inputName)
          input.setCheck('Number')
          input.connection?.setShadowState({
            type: 'number'
          })
          if (labelList.length > 0) {
            input.appendField(labelList.join(' '))
            labelList = []
          }
          break
        }
        case 'text': {
          const input = this.appendValueInput(inputName)
          input.setCheck('String')
          input.connection?.setShadowState({
            type: 'text'
          })
          if (labelList.length > 0) {
            input.appendField(labelList.join(' '))
            labelList = []
          }
          break
        }
      }
    }
  },

  saveExtraState(this: ProcedureBlock, doFullSerialization?: boolean) {
    if (!this.model) return
    if (!doFullSerialization) return { id: this.model.getId() }
    return {
      id: this.model.getId(),
      parameters: this.model.getParameters().map(p => ({
        name: p.getName(),
        id: p.getId(),
        type: p.getTypes()[0]
      })),
      returnTypes: this.model.getReturnTypes()
    }
  },

  loadExtraState(this: ProcedureBlock, state: { id: string }) {
    const workspace = this.workspace.targetWorkspace ?? this.workspace
    const model = workspace.getProcedureMap().get(state.id)

    if (model) {
      this.model = model as ProcedureModel
      this.doProcedureUpdate()
    }
  }
}
