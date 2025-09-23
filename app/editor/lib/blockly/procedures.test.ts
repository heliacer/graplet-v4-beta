import * as Blockly from 'blockly/core'
import {
  ObservableProcedureModel,
  ObservableParameterModel,
  ProcedureCreate
} from '@blockly/block-shareable-procedures'

interface IProcedureBlock extends Blockly.Block {
  getProcedureModel(): Blockly.procedures.IProcedureModel | null
  doProcedureUpdate(): void
  isProcedureDef(): boolean
  argsMap_: any
}

interface ProcedureState {
  procedureId?: string
  fullSerialization?: boolean
  params?: Array<{
    name: string
    id: string
    paramId?: string
  }>
  hasStatements?: boolean
  name?: string
}

/**
 * @todo get rid of "any"
 */

Blockly.Extensions.unregister('procedure_def_get_def_mixin')
Blockly.Extensions.unregister('procedure_def_var_mixin')
Blockly.Extensions.unregister('procedure_def_validator_helper')
Blockly.Extensions.unregister('procedure_def_update_shape_mixin')
Blockly.Extensions.unregister('procedure_def_mutator')
Blockly.Extensions.unregister('procedure_def_context_menu_mixin')
Blockly.Extensions.unregister('procedure_def_onchange_mixin')
Blockly.Extensions.unregister('procedure_defnoreturn_set_comment_helper')
Blockly.Extensions.unregister('procedure_defreturn_set_comment_helper')
Blockly.Extensions.unregister('procedure_defnoreturn_get_caller_block_mixin')
Blockly.Extensions.unregister('procedure_defreturn_get_caller_block_mixin')
Blockly.Extensions.unregister('procedure_def_set_no_return_helper')
Blockly.Extensions.unregister('procedure_def_set_return_helper')
Blockly.Extensions.unregister('procedure_caller_get_def_mixin')
Blockly.Extensions.unregister('procedure_caller_var_mixin')
Blockly.Extensions.unregister('procedure_caller_mutator')
Blockly.Extensions.unregister('procedure_caller_update_shape_mixin')
Blockly.Extensions.unregister('procedure_caller_onchange_mixin')
Blockly.Extensions.unregister('procedure_caller_context_menu_mixin')
Blockly.Extensions.unregister('procedure_callernoreturn_get_def_block_mixin')
Blockly.Extensions.unregister('procedure_callerreturn_get_def_block_mixin')

/**
 * A dictionary of the block definitions provided by this module.
 */
export const procedureBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  {
    type: 'procedures_defnoreturn',
    message0: '%{BKY_PROCEDURES_DEFNORETURN_TITLE} %1 %2 %3',
    message1: '%{BKY_PROCEDURES_DEFNORETURN_DO} %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: '',
        spellcheck: false,
      },
      {
        type: 'field_label',
        name: 'PARAMS',
        text: '',
      },
      {
        type: 'input_dummy',
        name: 'TOP',
      },
    ],
    args1: [
      {
        type: 'input_statement',
        name: 'STACK',
      },
    ],
    style: 'procedure_blocks',
    helpUrl: '%{BKY_PROCEDURES_DEFNORETURN_HELPURL}',
    tooltip: '%{BKY_PROCEDURES_DEFNORETURN_TOOLTIP}',
    extensions: [
      'procedure_def_get_def_mixin',
      'procedure_def_var_mixin',
      'procedure_def_update_shape_mixin',
      'procedure_def_context_menu_mixin',
      'procedure_def_onchange_mixin',
      'procedure_def_validator_helper',
      'procedure_defnoreturn_get_caller_block_mixin',
      'procedure_defnoreturn_set_comment_helper',
      'procedure_def_set_no_return_helper',
    ],
    mutator: 'procedure_def_mutator',
  },
  {
    type: 'procedures_callnoreturn',
    message0: '%1 %2',
    args0: [
      {type: 'field_label', name: 'NAME', text: '%{BKY_UNNAMED_KEY}'},
      {
        type: 'input_dummy',
        name: 'TOPROW',
      },
    ],
    nextStatement: null,
    previousStatement: null,
    style: 'procedure_blocks',
    helpUrl: '%{BKY_PROCEDURES_CALLNORETURN_HELPURL}',
    extensions: [
      'procedure_caller_get_def_mixin',
      'procedure_caller_var_mixin',
      'procedure_caller_update_shape_mixin',
      'procedure_caller_context_menu_mixin',
      'procedure_caller_onchange_mixin',
      'procedure_callernoreturn_get_def_block_mixin',
    ],
    mutator: 'procedure_caller_mutator',
  },
  {
    type: 'procedures_defreturn',
    message0: '%{BKY_PROCEDURES_DEFRETURN_TITLE} %1 %2 %3',
    message1: '%{BKY_PROCEDURES_DEFRETURN_DO} %1',
    message2: '%{BKY_PROCEDURES_DEFRETURN_RETURN} %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: '',
        spellcheck: false,
      },
      {
        type: 'field_label',
        name: 'PARAMS',
        text: '',
      },
      {
        type: 'input_dummy',
        name: 'TOP',
      },
    ],
    args1: [
      {
        type: 'input_statement',
        name: 'STACK',
      },
    ],
    args2: [
      {
        type: 'input_value',
        align: 'right',
        name: 'RETURN',
      },
    ],
    style: 'procedure_blocks',
    helpUrl: '%{BKY_PROCEDURES_DEFRETURN_HELPURL}',
    tooltip: '%{BKY_PROCEDURES_DEFRETURN_TOOLTIP}',
    extensions: [
      'procedure_def_get_def_mixin',
      'procedure_def_var_mixin',
      'procedure_def_update_shape_mixin',
      'procedure_def_context_menu_mixin',
      'procedure_def_onchange_mixin',
      'procedure_def_validator_helper',
      'procedure_defreturn_get_caller_block_mixin',
      'procedure_defreturn_set_comment_helper',
      'procedure_def_set_return_helper',
    ],
    mutator: 'procedure_def_mutator',
  },
  {
    type: 'procedures_callreturn',
    message0: '%1 %2',
    args0: [
      {type: 'field_label', name: 'NAME', text: '%{BKY_UNNAMED_KEY}'},
      {
        type: 'input_dummy',
        name: 'TOPROW',
      },
    ],
    output: null,
    style: 'procedure_blocks',
    helpUrl: '%{BKY_PROCEDURES_CALLRETURN_HELPURL}',
    extensions: [
      'procedure_caller_get_def_mixin',
      'procedure_caller_var_mixin',
      'procedure_caller_update_shape_mixin',
      'procedure_caller_context_menu_mixin',
      'procedure_caller_onchange_mixin',
      'procedure_callerreturn_get_def_block_mixin',
    ],
    mutator: 'procedure_caller_mutator',
  },
])

const procedureDefGetDefMixin = function(this: any) {
  const mixin = {
    model_: null as ObservableProcedureModel | null,

    getProcedureModel() {
      return this.model_
    },

    isProcedureDef() {
      return true
    },

    getVars() {
      const model = this.getProcedureModel()
      if (!model) return []
      
      return model
        .getParameters()
        .map((p: any) => p.getVariableModel().name)
    },

    getVarModels() {
      const model = this.getProcedureModel()
      if (!model) return []
      
      return model
        .getParameters()
        .map((p: any) => p.getVariableModel())
    },

    destroy() {
      if (!(this as any).isInsertionMarker()) {
        const model = this.getProcedureModel()
        if (model) {
          ;(this as any).workspace
            .getProcedureMap()
            .delete(model.getId())
        }
      }
    },
  }

  mixin.model_ = new ObservableProcedureModel(
    this.workspace,
    Blockly.Procedures.findLegalName(this.getFieldValue('NAME'), this),
  )

  // Events cannot be fired from instantiation when deserializing or dragging
  // from the flyout. So make this consistent and never fire from instantiation.
  Blockly.Events.disable()
  if (mixin.model_) {
    this.workspace.getProcedureMap().add(mixin.model_)
  }
  Blockly.Events.enable()

  this.mixin(mixin, true)
}

Blockly.Extensions.register(
  'procedure_def_get_def_mixin',
  procedureDefGetDefMixin,
)

const procedureDefVarMixin = function(this: any) {
  const mixin = {
    renameVarById(oldId: string, newId: string) {
      const oldVar = (this as any).workspace.getVariableById(oldId)
      const model = (this as any).getProcedureModel()
      if (!model || !oldVar) return
      
      const index = model
        .getParameters()
        .findIndex((p: any) => p.getVariableModel() === oldVar)
      if (index === -1) return
      
      const newVar = (this as any).workspace.getVariableById(newId)
      if (!newVar) return
      
      const oldParam = model.getParameter(index)
      if (oldParam) {
        oldParam.setName(newVar.name)
      }
    },

    updateVarName(variable: any) {
      const model = (this as any).getProcedureModel()
      if (!model) return
      
      const containsVar = model
        .getParameters()
        .some((p: any) => p.getVariableModel() === variable)
      if (containsVar) {
        ;(this as any).doProcedureUpdate()
      }
    },
  }

  this.mixin(mixin, true)
}

Blockly.Extensions.register('procedure_def_var_mixin', procedureDefVarMixin)

const procedureDefUpdateShapeMixin = {
  doProcedureUpdate(this: any) {
    const model = this.getProcedureModel()
    if (!model) return
    
    this.setFieldValue(model.getName(), 'NAME')
    this.setDisabledReason(!model.getEnabled())
    this.updateParameters_()
    this.updateMutator_()
  },

  updateParameters_(this: any) {
    const model = this.getProcedureModel()
    if (!model) return
    
    const params = model
      .getParameters()
      .map((p: any) => p.getName())
    const paramString = params.length
      ? `${Blockly.Msg['PROCEDURES_BEFORE_PARAMS']} ${params.join(', ')}`
      : ''

    Blockly.Events.disable()
    try {
      this.setFieldValue(paramString, 'PARAMS')
    } finally {
      Blockly.Events.enable()
    }
  },

  updateMutator_(this: any) {
    const mutator = this.getIcon(Blockly.icons.MutatorIcon.TYPE)
    if (!mutator?.bubbleIsVisible()) return

    const model = this.getProcedureModel()
    if (!model || !this.mutator) return

    const mutatorWorkspace = this.mutator.getWorkspace()
    for (const p of model.getParameters()) {
      const block = mutatorWorkspace.getBlockById(p.getId())
      if (!block) continue
      if (block.getFieldValue('NAME') !== p.getName()) {
        block.setFieldValue(p.getName(), 'NAME')
      }
    }
  },

  setStatements_(this: any, hasStatements: boolean) {
    if (this.hasStatements_ === hasStatements) {
      return
    }
    if (hasStatements) {
      this.appendStatementInput('STACK').appendField(
        Blockly.Msg['PROCEDURES_DEFNORETURN_DO'],
      )
      if (this.getInput('RETURN')) {
        this.moveInputBefore('STACK', 'RETURN')
      }
      if (this.statementConnection_) {
        this.statementConnection_(this, 'STACK')
        this.statementConnection_ = null
      }
    } else {
      const stackInput = this.getInput('STACK')
      if (stackInput?.connection) {
        const stackConnection = stackInput.connection
        this.statementConnection_ = stackConnection.targetConnection
        if (this.statementConnection_) {
          const stackBlock = stackConnection.targetBlock()
          if (stackBlock) {
            stackBlock.unplug()
            stackBlock.bumpNeighbours()
          }
        }
      }
      this.removeInput('STACK', true)
    }
    this.hasStatements_ = hasStatements
  },
}

Blockly.Extensions.registerMixin(
  'procedure_def_update_shape_mixin',
  procedureDefUpdateShapeMixin,
)

const procedureDefValidatorHelper = function(this: any) {
  const nameField = this.getField('NAME')
  if (nameField) {
    nameField.setValue(Blockly.Procedures.findLegalName('', this))
    nameField.setValidator(Blockly.Procedures.rename)
  }
}

Blockly.Extensions.register(
  'procedure_def_validator_helper',
  procedureDefValidatorHelper,
)

const procedureDefMutator = {
  hasStatements_: true,

  mutationToDom(this: any): Element {
    const container = Blockly.utils.xml.createElement('mutation')
    const model = this.getProcedureModel()
    if (!model) return container
    
    const params = model.getParameters()
    for (const param of params) {
      const parameter = Blockly.utils.xml.createElement('arg')
      const varModel = param.getVariableModel()
      parameter.setAttribute('name', varModel.name)
      parameter.setAttribute('varid', varModel.getId())
      container.appendChild(parameter)
    }

    if (!this.hasStatements_) {
      container.setAttribute('statements', 'false')
    }
    return container
  },

  domToMutation(this: any, xmlElement: Element) {
    const childNodes = Array.from(xmlElement.childNodes)
    for (const [index, node] of childNodes.entries()) {
      if (node.nodeName.toLowerCase() !== 'arg') continue
      const varId = (node as Element).getAttribute('varid')
      const name = (node as Element).getAttribute('name')
      if (name && varId) {
        const model = this.getProcedureModel()
        if (model) {
          model.insertParameter(
            new ObservableParameterModel(
              this.workspace,
              name,
              undefined,
              varId,
            ),
            index,
          )
        }
      }
    }
    this.setStatements_(xmlElement.getAttribute('statements') !== 'false')
  },

  saveExtraState(this: any, doFullSerialization?: boolean): ProcedureState {
    const state: ProcedureState = Object.create(null)
    const model = this.getProcedureModel()
    if (!model) return state
    
    state.procedureId = model.getId()

    if (doFullSerialization) {
      state.fullSerialization = true
      const params = model.getParameters()
      if (params.length) {
        state.params = params.map((p: any) => ({
          name: p.getName(),
          id: p.getVariableModel().getId(),
          paramId: p.getId(),
        }))
      }
    }
    if (!this.hasStatements_) {
      state.hasStatements = false
    }
    return state
  },

  loadExtraState(this: any, state: ProcedureState) {
    const map = this.workspace.getProcedureMap()

    const procedureId = state.procedureId
    if (procedureId && map.has(procedureId) && !state.fullSerialization) {
      if (this.model_ && map.has(this.model_.getId())) {
        map.delete(this.model_.getId())
      }
      this.model_ = map.get(procedureId) || null
    }

    const model = this.getProcedureModel()
    if (!model) return
    
    const newParams = state.params ?? []
    const newIds = new Set(newParams.map((p: any) => p.id))
    const currParams = model.getParameters()
    
    if (state.fullSerialization) {
      const reversedIndices: number[] = []
      for (let i = currParams.length - 1; i >= 0; i--) {
        reversedIndices.push(i)
      }
      
      for (const index of reversedIndices) {
        const param = currParams[index]
        if (param && !newIds.has(param.getId())) {
          model.deleteParameter(index)
        }
      }
    }
    
    for (const [index, paramData] of newParams.entries()) {
      const {name, id, paramId} = paramData
      model.insertParameter(
        new ObservableParameterModel(this.workspace, name, paramId, id),
        index,
      )
    }

    this.doProcedureUpdate()
    this.setStatements_(state.hasStatements === false ? false : true)
  },

  decompose(this: any, workspace: Blockly.Workspace): Blockly.Block {
    const containerBlockDef = {
      type: 'procedures_mutatorcontainer',
      inputs: {
        STACK: {} as any,
      },
    }

    let connDef = containerBlockDef.inputs.STACK
    const model = this.getProcedureModel()
    if (model) {
      for (const param of model.getParameters()) {
        connDef.block = {
          type: 'procedures_mutatorarg',
          id: param.getId(),
          fields: {
            NAME: param.getName(),
          },
          next: {},
        }
        connDef = connDef.block.next
      }
    }

    const containerBlock = Blockly.serialization.blocks.append(
      containerBlockDef as any,
      workspace,
      {recordUndo: false},
    )

    if (this.type === 'procedures_defreturn') {
      containerBlock.setFieldValue(this.hasStatements_, 'STATEMENTS')
    } else {
      containerBlock.removeInput('STATEMENT_INPUT')
    }

    return containerBlock
  },

  compose(this: any, containerBlock: Blockly.Block) {
    this.deleteParamsFromModel_(containerBlock)
    this.renameParamsInModel_(containerBlock)
    this.addParamsToModel_(containerBlock)

    const hasStatements = containerBlock.getFieldValue('STATEMENTS')
    if (hasStatements !== null) {
      this.setStatements_(hasStatements === 'TRUE')
    }
  },

  deleteParamsFromModel_(containerBlock: Blockly.Block) {
    const ids = new Set(containerBlock.getDescendants(false).map((b: Blockly.Block) => b.id))
    const model = (this as any).getProcedureModel()
    if (!model) return
    
    const count = model.getParameters().length
    for (let i = count - 1; i >= 0; i--) {
      const param = model.getParameter(i)
      if (param && !ids.has(param.getId())) {
        model.deleteParameter(i)
      }
    }
  },

  renameParamsInModel_(containerBlock: Blockly.Block) {
    const model = (this as any).getProcedureModel()
    if (!model) return

    let i = 0
    let paramBlock = containerBlock.getInputTargetBlock('STACK')
    while (paramBlock && !paramBlock.isInsertionMarker()) {
      const param = model.getParameter(i)
      if (
        param &&
        param.getId() === paramBlock.id &&
        param.getName() !== paramBlock.getFieldValue('NAME')
      ) {
        param.setName(paramBlock.getFieldValue('NAME'))
      }
      paramBlock = paramBlock.nextConnection?.targetBlock() || null
      i++
    }
  },

  addParamsToModel_(containerBlock: Blockly.Block) {
    const model = (this as any).getProcedureModel()
    if (!model) return

    let i = 0
    let paramBlock = containerBlock.getInputTargetBlock('STACK')
    while (paramBlock && !paramBlock.isInsertionMarker()) {
      const existingParam = model.getParameter(i)
      if (
        !existingParam ||
        existingParam.getId() !== paramBlock.id
      ) {
        model.insertParameter(
          new ObservableParameterModel(
            (this as any).workspace,
            paramBlock.getFieldValue('NAME'),
            paramBlock.id,
          ),
          i,
        )
      }
      paramBlock = paramBlock.nextConnection?.targetBlock() || null
      i++
    }
  },
}

Blockly.Extensions.registerMutator(
  'procedure_def_mutator',
  procedureDefMutator,
  undefined,
  ['procedures_mutatorarg'],
)

const procedureDefContextMenuMixin = {
  customContextMenu(this: any, options: any[]) {
    if (this.isInFlyout) {
      return
    }

    const xmlMutation = Blockly.utils.xml.createElement('mutation')
    xmlMutation.setAttribute('name', this.getFieldValue('NAME'))
    const model = this.getProcedureModel()
    if (model) {
      const params = model.getParameters()
      for (const param of params) {
        const xmlArg = Blockly.utils.xml.createElement('arg')
        xmlArg.setAttribute('name', param.getName())
        xmlMutation.appendChild(xmlArg)
      }
    }
    const xmlBlock = Blockly.utils.xml.createElement('block')
    xmlBlock.setAttribute('type', this.callType_)
    xmlBlock.appendChild(xmlMutation)

    options.push({
      enabled: true,
      text: Blockly.Msg['PROCEDURES_CREATE_DO'].replace(
        '%1',
        this.getFieldValue('NAME'),
      ),
      callback: Blockly.ContextMenu.callbackFactory(this, xmlBlock),
    })

    if (this.isCollapsed()) return

    if (model) {
      const params = model.getParameters()
      for (const param of params) {
        const argVar = param.getVariableModel()
        const argXmlField = Blockly.Variables.generateVariableFieldDom(argVar)
        const argXmlBlock = Blockly.utils.xml.createElement('block')
        argXmlBlock.setAttribute('type', 'variables_get')
        argXmlBlock.appendChild(argXmlField)
        options.push({
          enabled: true,
          text: Blockly.Msg['VARIABLES_SET_CREATE_GET'].replace(
            '%1',
            argVar.name,
          ),
          callback: Blockly.ContextMenu.callbackFactory(this, argXmlBlock),
        })
      }
    }
  },
}

Blockly.Extensions.registerMixin(
  'procedure_def_context_menu_mixin',
  procedureDefContextMenuMixin,
)

const procedureDefOnChangeMixin = {
  onchange(this: any, e: any) {
    if (e.type === Blockly.Events.BLOCK_CREATE && e.blockId === this.id) {
      const model = this.getProcedureModel()
      if (model) {
        Blockly.Events.fire(new ProcedureCreate(this.workspace, model))
      }
    }
    if (
      e.type === Blockly.Events.BLOCK_CHANGE &&
      e.blockId === this.id &&
      e.element === 'disabled'
    ) {
      const model = this.getProcedureModel()
      if (model) {
        model.setEnabled(this.isEnabled())
      }
    }
  },
}

Blockly.Extensions.registerMixin(
  'procedure_def_onchange_mixin',
  procedureDefOnChangeMixin,
)

const procedureDefNoReturnSetCommentHelper = function(this: any) {
  if (
    (this.workspace.options.comments ||
      (this.workspace.options.parentWorkspace &&
        this.workspace.options.parentWorkspace.options.comments)) &&
    Blockly.Msg['PROCEDURES_DEFNORETURN_COMMENT']
  ) {
    this.setCommentText(Blockly.Msg['PROCEDURES_DEFNORETURN_COMMENT'])
  }
}

Blockly.Extensions.register(
  'procedure_defnoreturn_set_comment_helper',
  procedureDefNoReturnSetCommentHelper,
)

const procedureDefReturnSetCommentHelper = function(this: any) {
  if (
    (this.workspace.options.comments ||
      (this.workspace.options.parentWorkspace &&
        this.workspace.options.parentWorkspace.options.comments)) &&
    Blockly.Msg['PROCEDURES_DEFRETURN_COMMENT']
  ) {
    this.setCommentText(Blockly.Msg['PROCEDURES_DEFRETURN_COMMENT'])
  }
}

Blockly.Extensions.register(
  'procedure_defreturn_set_comment_helper',
  procedureDefReturnSetCommentHelper,
)

const procedureDefNoReturnGetCallerBlockMixin = {
  callType_: 'procedures_callnoreturn',
}

Blockly.Extensions.registerMixin(
  'procedure_defnoreturn_get_caller_block_mixin',
  procedureDefNoReturnGetCallerBlockMixin,
)

const procedureDefReturnGetCallerBlockMixin = {
  callType_: 'procedures_callreturn',
}

Blockly.Extensions.registerMixin(
  'procedure_defreturn_get_caller_block_mixin',
  procedureDefReturnGetCallerBlockMixin,
)

const procedureDefSetNoReturnHelper = function(this: any) {
  const model = this.getProcedureModel()
  if (model) {
    model.setReturnTypes(null)
  }
}

Blockly.Extensions.register(
  'procedure_def_set_no_return_helper',
  procedureDefSetNoReturnHelper,
)

const procedureDefSetReturnHelper = function(this: any) {
  const model = this.getProcedureModel()
  if (model) {
    model.setReturnTypes([])
  }
}

Blockly.Extensions.register(
  'procedure_def_set_return_helper',
  procedureDefSetReturnHelper,
)

const procedureCallerGetDefMixin = function(this: IProcedureBlock) {
  const mixin = {
    model_: null as ObservableProcedureModel | null,
    prevParams_: [] as any[],
    argsMap_: new Map<string, Blockly.Block>(),

    getProcedureModel() {
      return this.model_
    },

    findProcedureModel_(name: string, params: string[] = []) {
      const workspace = this.getTargetWorkspace_()
      const model = workspace
        .getProcedureMap()
        .getProcedures()
        .find((proc: any) => proc.getName() === name)
      if (!model) return null

      const returnTypes = model.getReturnTypes()
      const hasMatchingReturn = (this as any).hasReturn_ ? returnTypes : !returnTypes
      if (!hasMatchingReturn) return null

      const hasMatchingParams = model
        .getParameters()
        .every((p: any, i: number) => p.getName() === params[i])
      if (!hasMatchingParams) return null

      return model
    },

    getTargetWorkspace_() {
      return (this as any).workspace.isFlyout
        ? (this as any).workspace.targetWorkspace
        : (this as any).workspace
    },

    isProcedureDef() {
      return false
    },

    getVars() {
      const model = this.getProcedureModel()
      if (!model) return []
      
      return model
        .getParameters()
        .map((p: any) => p.getVariableModel().name)
    },

    getVarModels() {
      const model = this.getProcedureModel()
      if (!model) return []
      
      return model
        .getParameters()
        .map((p: any) => p.getVariableModel())
    },
  }

  this.mixin(mixin, true)
}

Blockly.Extensions.register(
  'procedure_caller_get_def_mixin',
  procedureCallerGetDefMixin,
)

const procedureCallerVarMixin = function(this: IProcedureBlock) {
  const mixin = {
    updateVarName(variable: any) {
      const model = (this as any).getProcedureModel()
      if (!model) return
      
      const containsVar = model
        .getParameters()
        .some((p: any) => p.getVariableModel() === variable)
      if (containsVar) {
        ;(this as any).doProcedureUpdate()
      }
    },
  }

  this.mixin(mixin, true)
}

Blockly.Extensions.register(
  'procedure_caller_var_mixin',
  procedureCallerVarMixin,
)

const procedureCallerMutator = {
  paramsFromSerializedState_: [] as string[],

  mutationToDom(this: any): Element {
    const container = Blockly.utils.xml.createElement('mutation')
    const model = this.getProcedureModel()
    if (!model) return container

    container.setAttribute('name', model.getName())
    for (const param of model.getParameters()) {
      const arg = Blockly.utils.xml.createElement('arg')
      arg.setAttribute('name', param.getName())
      container.appendChild(arg)
    }
    return container
  },

  domToMutation(this: any, xmlElement: Element) {
    const name = xmlElement.getAttribute('name')
    const params: string[] = []
    
    for (const node of Array.from(xmlElement.childNodes)) {
      if (node.nodeName.toLowerCase() === 'arg') {
        const argName = (node as Element).getAttribute('name')
        if (argName) {
          params.push(argName)
        }
      }
    }
    
    if (name) {
      this.deserialize_(name, params)
    }
  },

  saveExtraState(this: any): ProcedureState {
    const state: ProcedureState = Object.create(null)
    const model = this.getProcedureModel()
    
    if (!model) {
      state.name = this.getFieldValue('NAME')
      state.params = this.paramsFromSerializedState_
      return state
    }
    
    state.name = model.getName()
    if (model.getParameters().length) {
      state.params = model.getParameters().map((p: any) => p.getName())
    }
    return state
  },

  loadExtraState(this: any, state: ProcedureState) {
    this.deserialize_(state.name || '', state.params || [])
  },

  deserialize_(this: any, name: string, params: string[]) {
    this.setFieldValue(name, 'NAME')
    if (!this.model_) {
      this.model_ = this.findProcedureModel_(name, params)
    }
    if (this.getProcedureModel()) {
      this.initBlockWithProcedureModel_()
    } else {
      this.createArgInputs_(params)
    }
    this.paramsFromSerializedState_ = params
  },
}

Blockly.Extensions.registerMutator(
  'procedure_caller_mutator',
  procedureCallerMutator,
)

const PROCEDURE_MODEL_DISABLED_REASON = 'PROCEDURE_MODEL_DISABLED'

const procedureCallerUpdateShapeMixin = {
  initBlockWithProcedureModel_(this: any) {
    const model = this.getProcedureModel()
    if (model) {
      this.prevParams_ = [...model.getParameters()]
      this.doProcedureUpdate()
    }
  },

  doProcedureUpdate(this: any) {
    const model = this.getProcedureModel()
    if (!model || this.isDeadOrDying()) return
    
    const id = model.getId()
    if (
      !this.getTargetWorkspace_().getProcedureMap().has(id) &&
      !this.isInFlyout
    ) {
      this.dispose(true)
      return
    }
    this.updateName_()
    this.updateEnabled_()
    this.updateParameters_()
  },

  updateName_(this: any) {
    const model = this.getProcedureModel()
    if (!model) return
    
    const name = model.getName()
    this.setFieldValue(name, 'NAME')
    const baseMsg = this.outputConnection
      ? Blockly.Msg['PROCEDURES_CALLRETURN_TOOLTIP']
      : Blockly.Msg['PROCEDURES_CALLNORETURN_TOOLTIP']
    this.setTooltip(baseMsg.replace('%1', name))
  },

  updateEnabled_(this: any) {
    const model = this.getProcedureModel()
    if (!model) return
    
    this.setDisabledReason(
      !model.getEnabled(),
      PROCEDURE_MODEL_DISABLED_REASON,
    )
  },

  updateParameters_(this: any) {
    this.syncArgsMap_()
    this.deleteAllArgInputs_()
    this.addParametersLabel__()
    this.createArgInputs_()
    this.reattachBlocks_()
    const model = this.getProcedureModel()
    if (model) {
      this.prevParams_ = [...model.getParameters()]
    }
  },

  syncArgsMap_(this: any) {
    for (const [i, p] of this.prevParams_.entries()) {
      const target = this.getInputTargetBlock(`ARG${i}`)
      if (target) {
        this.argsMap_.set(p.getId(), target)
      }
    }
  },

  updateArgsMap_(this: any) {
    const model = this.getProcedureModel()
    if (!model) return
    
    for (const [i, p] of model.getParameters().entries()) {
      const target = this.getInputTargetBlock(`ARG${i}`)
      if (target) {
        this.argsMap_.set(p.getId(), target)
      } else {
        this.argsMap_.delete(p.getId())
      }
    }
  },

  deleteAllArgInputs_(this: any) {
    let i = 0
    while (this.getInput(`ARG${i}`)) {
      this.removeInput(`ARG${i}`)
      i++
    }
  },

  addParametersLabel__(this: any) {
    const topRow = this.getInput('TOPROW')
    const model = this.getProcedureModel()
    if (!topRow || !model) return
    
    if (model.getParameters().length) {
      if (!this.getField('WITH')) {
        topRow.appendField(
          Blockly.Msg['PROCEDURES_CALL_BEFORE_PARAMS'],
          'WITH',
        )
        topRow.init()
      }
    } else if (this.getField('WITH')) {
      topRow.removeField('WITH')
    }
  },

  createArgInputs_(this: IProcedureBlock, params?: string[] | null) {
    let paramNames: string[]
    
    if (!params) {
      const model = this.getProcedureModel()
      if (!model) return
      paramNames = model
        .getParameters()
        .map((p: any) => p.getName())
    } else {
      paramNames = params
    }
    
    for (const [i, paramName] of paramNames.entries()) {
      this.appendValueInput(`ARG${i}`)
        .appendField(new Blockly.FieldLabel(paramName), `ARGNAME${i}`)
        .setAlign(Blockly.inputs.Align.RIGHT)
    }
  },

  reattachBlocks_(this: IProcedureBlock) {
    const model = this.getProcedureModel()
    if (!model) return
    
    const params = model.getParameters()
    for (const [i, p] of params.entries()) {
      if (!this.argsMap_?.has(p.getId())) continue
      const input = this.getInput(`ARG${i}`)
      const targetBlock = this.argsMap_.get(p.getId())
      if (input?.connection && targetBlock?.outputConnection) {
        input.connection.connect(targetBlock.outputConnection)
      }
    }
  },

  renameProcedure(this: any, oldName: string, newName: string) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('NAME'))) {
      this.setFieldValue(newName, 'NAME')
      const baseMsg = this.outputConnection
        ? Blockly.Msg['PROCEDURES_CALLRETURN_TOOLTIP']
        : Blockly.Msg['PROCEDURES_CALLNORETURN_TOOLTIP']
      this.setTooltip(baseMsg.replace('%1', newName))
    }
  },
}

Blockly.Extensions.registerMixin(
  'procedure_caller_update_shape_mixin',
  procedureCallerUpdateShapeMixin,
)

const procedureCallerOnChangeMixin = {
  onchange(this: any, event: any) {
    if (this.disposed || this.workspace.isFlyout) return
    
    if (event.type === Blockly.Events.BLOCK_MOVE) {
      this.updateArgsMap_()
    }
    
    if (
      event.type !== Blockly.Events.FINISHED_LOADING &&
      !this.eventIsCreatingThisBlockDuringPaste_(event)
    ) {
      return
    }

    if (this.getProcedureModel()) return

    const name = this.getFieldValue('NAME')
    let def = Blockly.Procedures.getDefinition(name, this.workspace)
    if (!this.defMatches_(def)) def = null
    
    if (!def) {
      Blockly.Events.setGroup(event.group)
      this.model_ = this.createDef_(
        this.getFieldValue('NAME'),
        this.paramsFromSerializedState_,
      )
      Blockly.Events.setGroup(false)
    }
    
    if (!this.getProcedureModel()) {
      this.model_ = this.findProcedureModel_(
        this.getFieldValue('NAME'),
        this.paramsFromSerializedState_,
      )
    }
    
    this.initBlockWithProcedureModel_()
  },

  eventIsCreatingThisBlockDuringPaste_(this: any, event: any): boolean {
    return (
      event.type === Blockly.Events.BLOCK_CREATE &&
      (event.blockId === this.id || 
       (event.ids && event.ids.indexOf(this.id) !== -1)) &&
      event.recordUndo
    )
  },

  defMatches_(this: any, defBlock: Blockly.Block | null): boolean {
    return (
      defBlock !== null &&
      defBlock.type === this.defType_ &&
      JSON.stringify(defBlock.getVars()) ===
        JSON.stringify(this.paramsFromSerializedState_)
    )
  },

  createDef_(this: any, name: string, params: string[] = []) {
    const xy = this.getRelativeToSurfaceXY()
    const newName = Blockly.Procedures.findLegalName(name, this)
    this.renameProcedure(name, newName)

    const blockDef = {
      type: this.defType_,
      x: xy.x + Blockly.config.snapRadius * (this.RTL ? -1 : 1),
      y: xy.y + Blockly.config.snapRadius * 2,
      extraState: {
        params: params.map((p: string) => ({name: p})),
      },
      fields: {NAME: newName},
    }
    
    const block = Blockly.serialization.blocks.append(
      blockDef,
      this.getTargetWorkspace_(),
      {recordUndo: true},
    )
    
    return (block as IProcedureBlock).getProcedureModel()
  },
}

Blockly.Extensions.registerMixin(
  'procedure_caller_onchange_mixin',
  procedureCallerOnChangeMixin,
)

const procedureCallerContextMenuMixin = {
  customContextMenu(this: any, options: any[]) {
    if (!this.workspace.isMovable()) {
      return
    }

    const name = this.getFieldValue('NAME')
    const workspace = this.workspace
    
    const callback = () => {
      const def = Blockly.Procedures.getDefinition(name, workspace)
      if (def && def instanceof Blockly.BlockSvg) {
        workspace.centerOnBlock(def.id)
        def.select()
      }
    }
    
    options.push({
      enabled: true,
      text: Blockly.Msg['PROCEDURES_HIGHLIGHT_DEF'],
      callback,
    })
  },
}


Blockly.Extensions.registerMixin(
  'procedure_caller_context_menu_mixin',
  procedureCallerContextMenuMixin,
)

const procedureCallerNoReturnGetDefBlockMixin = {
  hasReturn_: false,
  defType_: 'procedures_defnoreturn',
}

Blockly.Extensions.registerMixin(
  'procedure_callernoreturn_get_def_block_mixin',
  procedureCallerNoReturnGetDefBlockMixin,
)

const procedureCallerReturnGetDefBlockMixin = {
  hasReturn_: true,
  defType_: 'procedures_callreturn',
}

Blockly.Extensions.registerMixin(
  'procedure_callerreturn_get_def_block_mixin',
  procedureCallerReturnGetDefBlockMixin,
)