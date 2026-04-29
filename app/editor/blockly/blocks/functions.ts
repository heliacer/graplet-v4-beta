import { Blocks, common, serialization } from 'blockly'
import { ParameterBlock, ProcedureBlock, ProcedureState } from '../../types'
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

/** @todo cleanup */
function rebuildParameters(block: ProcedureBlock, shadow?: boolean) {
  if (!block.model) return
  for (const input of [...block.inputList]) {
    block.removeInput(input.name)
  }
  const params = block.model.getParameters()
  for (let i = 0; i < params.length; i++) {
    const [type] = params[i].getTypes()
    const name = params[i].getName()
    const inputName = `ARG${i}`
    if (type === 'Label') {
      block.appendDummyInput(inputName).appendField(name)
    } else {
      const input = block.appendValueInput(inputName)
      input.setCheck(type)
      if (shadow) {
        const shadowBlockType =
          type === 'String'
            ? 'text'
            : type === 'Number'
              ? 'number'
              : 'logic_boolean'
        input.connection?.setShadowState({
          type: shadowBlockType
        })
      } else {
        /** @todo actually append the blocks */
        serialization.blocks.append(
          {
            type: 'function_param',
            extraState: {
              id: block.model.getId(),
              index: i
            }
          },
          block.workspace
        )
      }
    }
  }
}

function getExtraState(model: ProcedureModel): ProcedureState {
  return {
    id: model.getId(),
    name: '',
    parameters: model.getParameters().map(p => ({
      name: p.getName(),
      id: p.getId(),
      types: p.getTypes()
    })),
    returnTypes: model.getReturnTypes()
  }
}

Blocks['function_def'] = {
  init(this: ProcedureBlock) {
    this.setNextStatement(true, null)
    this.setInputsInline(true)
    this.setStyle('function_blocks')
    this.model = null
  },

  doProcedureUpdate(this: ProcedureBlock) {
    rebuildParameters(this)
  },

  saveExtraState(this: ProcedureBlock, doFullSerialization?: boolean) {
    if (!this.model) return
    if (!doFullSerialization) return { id: this.model.getId() }
    return getExtraState(this.model)
  },

  loadExtraState(this: ProcedureBlock, state: { id: string }) {
    const workspace = this.workspace
    const model = workspace.getProcedureMap().get(state.id)
    if (model) {
      this.model = model as ProcedureModel
      this.doProcedureUpdate()
    }
  },

  destroy(this: ProcedureBlock) {
    if (!this.model) return
    this.workspace.getProcedureMap().delete(this.model.getId())
    const blocks = this.workspace.getAllBlocks(false)
    for (const block of blocks) {
      const model = (block as ProcedureBlock).model
      if (model && model.getId() === this.model.getId()) {
        block.dispose()
      }
    }
  }
}

Blocks['function_call'] = {
  init(this: ProcedureBlock) {
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setStyle('function_blocks')
    this.setInputsInline(true)
    this.model = null
  },

  doProcedureUpdate(this: ProcedureBlock) {
    if (!this.model) return
    rebuildParameters(this, true)
  },

  saveExtraState(this: ProcedureBlock, doFullSerialization?: boolean) {
    if (!this.model) return
    if (!doFullSerialization) return { id: this.model.getId() }
    return getExtraState(this.model)
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

Blocks['function_param'] = {
  init(this: ParameterBlock) {
    this.appendDummyInput().appendField('', 'NAME')
    this.setStyle('function_blocks')
    this.setInputsInline(true)
    this.setOutput(true)
    this.model = null
    this.index = 0
  },

  doProcedureUpdate(this: ParameterBlock) {
    if (!this.model) return
    const param = this.model.getParameter(this.index)
    this.setFieldValue(param.getName(), 'NAME')
    this.setOutput(true, param.getTypes()[0])
    console.log(param)
  },

  saveExtraState(this: ParameterBlock, doFullSerialization?: boolean) {
    if (!this.model) return
    if (!doFullSerialization) return { id: this.model.getId() }
    return getExtraState(this.model)
  },

  /** @todo create separate extrastate for params */
  loadExtraState(this: ParameterBlock, state: { id: string; index: number }) {
    const model = this.workspace.getProcedureMap().get(state.id)
    this.index = state.index
    if (model) {
      this.model = model as ProcedureModel
      this.doProcedureUpdate()
    }
  }
}
