import type { Block, WorkspaceSvg, Connection } from 'blockly'
import { Msg, fieldRegistry } from 'blockly'
import type { IVariableModel, IVariableState } from 'blockly'

export interface CallBlock extends Block {
  argumentVarModels_: IVariableModel<IVariableState>[]
  arguments_: string[]
  defType_: string
  quarkIds_: string[] | null
  quarkConnections_: { [id: string]: Connection }
  workspace: WorkspaceSvg
  getProcedureCall(): string
  updateShape_(): void
  setProcedureParameters_(paramNames: string[], paramIds: string[]): void
  renameProcedure(oldName: string, newName: string): void
}

const PROCEDURE_CALL_COMMON = {
  getProcedureCall: function (this: CallBlock): string {
    return this.getFieldValue('NAME')
  },

  renameProcedure: function (
    this: CallBlock,
    oldName: string,
    newName: string
  ) {
    if (oldName === this.getProcedureCall()) {
      this.setFieldValue(newName, 'NAME')
      const baseMsg = this.outputConnection
        ? Msg['PROCEDURES_CALLRETURN_TOOLTIP']
        : Msg['PROCEDURES_CALLNORETURN_TOOLTIP']
      this.setTooltip(baseMsg.replace('%1', newName))
    }
  },

  setProcedureParameters_: function (
    this: CallBlock,
    paramNames: string[],
    paramIds: string[]
  ) {
    // Store existing connections before rebuilding
    if (!this.quarkIds_) {
      this.quarkConnections_ = {}
      this.quarkIds_ = []
    }

    // Save existing connections
    for (let i = 0; i < this.arguments_.length; i++) {
      const input = this.getInput('ARG' + i)
      if (input) {
        const connection = input.connection!.targetConnection!
        if (this.quarkIds_[i]) {
          this.quarkConnections_[this.quarkIds_[i]] = connection
        }
      }
    }

    // Update arguments
    this.arguments_ = [...paramNames]
    this.argumentVarModels_ = []

    // Create variable models for arguments
    for (const argName of this.arguments_) {
      const variable =
        this.workspace.getVariable(argName, '') ||
        this.workspace.createVariable(argName, '')
      this.argumentVarModels_.push(variable)
    }

    this.updateShape_()
    this.quarkIds_ = paramIds

    // Reconnect existing blocks
    if (this.quarkIds_) {
      for (let i = 0; i < this.arguments_.length; i++) {
        const quarkId: string = this.quarkIds_[i]
        if (quarkId in this.quarkConnections_) {
          const connection: Connection | undefined =
            this.quarkConnections_[quarkId]
          if (connection && !connection.reconnect(this, 'ARG' + i)) {
            // Connection failed, remove from tracking
            delete this.quarkConnections_[quarkId]
          }
        }
      }
    }
  },

  /**
   * Modify this block to have the correct number of arguments with shadows.
   */
  updateShape_: function (this: CallBlock) {
    // Update existing inputs
    for (let i = 0; i < this.arguments_.length; i++) {
      const argField = this.getField('ARGNAME' + i)
      if (argField) {
        // Update existing field
        argField.setValue(this.arguments_[i])
      } else {
        // Create new input with shadow
        const newField =
          fieldRegistry.fromJson({
            type: 'field_label',
            text: this.arguments_[i]
          }) ?? this.arguments_[i]

        const input = this.appendValueInput('ARG' + i)
          .setAlign(1)
          .appendField(newField, 'ARGNAME' + i)

        input.connection?.setShadowState({
          type: 'input',
          fields: { VALUE: '' }
        })
      }
    }

    // Remove excess inputs
    for (let i = this.arguments_.length; this.getInput('ARG' + i); i++) {
      this.removeInput('ARG' + i)
    }

    // Update 'with:' label
    const topRow = this.getInput('TOPROW')
    if (topRow) {
      if (this.arguments_.length) {
        if (!this.getField('WITH')) {
          topRow.appendField(Msg['PROCEDURES_CALL_BEFORE_PARAMS'], 'WITH')
        }
      } else {
        if (this.getField('WITH')) {
          topRow.removeField('WITH')
        }
      }
    }
  },

  // Backwards compatibility
  mutationToDom: function (this: CallBlock) {
    const container = document.createElement('mutation')
    container.setAttribute('name', this.getProcedureCall())
    for (let i = 0; i < this.arguments_.length; i++) {
      const parameter = document.createElement('arg')
      parameter.setAttribute('name', this.arguments_[i])
      container.appendChild(parameter)
    }
    return container
  },

  domToMutation: function (this: CallBlock, xmlElement: Element) {
    const name = xmlElement.getAttribute('name')!
    this.renameProcedure(this.getProcedureCall(), name)
    const args: string[] = []
    const paramIds: string[] = []

    for (let i = 0; i < xmlElement.childNodes.length; i++) {
      const childNode = xmlElement.childNodes[i]
      if (childNode.nodeName.toLowerCase() === 'arg') {
        const element = childNode as Element
        args.push(element.getAttribute('name')!)
        paramIds.push(element.getAttribute('paramId') || '')
      }
    }
    this.setProcedureParameters_(args, paramIds)
  },

  saveExtraState: function (this: CallBlock) {
    const state: { name: string; params?: string[] } = {
      name: this.getProcedureCall()
    }
    if (this.arguments_.length) {
      state.params = this.arguments_
    }
    return state
  },

  loadExtraState: function (
    this: CallBlock,
    state: { name: string; params: string[] }
  ) {
    this.renameProcedure(this.getProcedureCall(), state.name)
    const params = state.params
    if (params) {
      const ids: string[] = new Array(params.length).fill('')
      this.setProcedureParameters_(params, ids)
    }
  },

  getVars: function (this: CallBlock): string[] {
    return this.arguments_
  },

  getVarModels: function (this: CallBlock) {
    return this.argumentVarModels_
  }
}

// Override the call blocks
export const PROCEDURES_CALLNORETURN = {
  ...PROCEDURE_CALL_COMMON,
  init: function (this: CallBlock) {
    this.appendDummyInput('TOPROW').appendField('', 'NAME')
    this.setPreviousStatement(true)
    this.setNextStatement(true)
    this.setStyle('procedure_blocks')
    this.setHelpUrl(Msg['PROCEDURES_CALLNORETURN_HELPURL'])
    this.setInputsInline(true)
    this.arguments_ = []
    this.argumentVarModels_ = []
    this.quarkConnections_ = {}
    this.quarkIds_ = null
  },
  defType_: 'procedures_defnoreturn'
}

export const PROCEDURES_CALLRETURN = {
  ...PROCEDURE_CALL_COMMON,
  init: function (this: CallBlock) {
    this.appendDummyInput('TOPROW').appendField('', 'NAME')
    this.setOutput(true)
    this.setStyle('procedure_blocks')
    this.setHelpUrl(Msg['PROCEDURES_CALLRETURN_HELPURL'])
    this.setInputsInline(true)
    this.arguments_ = []
    this.argumentVarModels_ = []
    this.quarkConnections_ = {}
    this.quarkIds_ = null
  },
  defType_: 'procedures_defreturn'
}
