import type { Block, WorkspaceSvg } from 'blockly'
import { Msg } from 'blockly'

/**
 * @override ifReturn Block
 */

export interface IfReturnBlock extends Block {
  hasReturnValue_: boolean
  FUNCTION_TYPES: string[]
  workspace: WorkspaceSvg
  isInFlyout: boolean
}

export const PROCEDURES_IFRETURN = {
  init: function (this: IfReturnBlock) {
    this.appendValueInput('CONDITION')
      .setCheck('Boolean')
      .appendField(Msg['CONTROLS_IF_MSG_IF'])
    const valueInput = this.appendValueInput('VALUE').appendField(
      Msg['PROCEDURES_DEFRETURN_RETURN']
    )

    valueInput.connection?.setShadowState({
      type: 'input',
      fields: { VALUE: '' }
    })

    this.setInputsInline(true)
    this.setPreviousStatement(true)
    this.setNextStatement(true)
    this.setStyle('procedure_blocks')
    this.setTooltip(Msg['PROCEDURES_IFRETURN_TOOLTIP'])
    this.setHelpUrl(Msg['PROCEDURES_IFRETURN_HELPURL'])
    this.hasReturnValue_ = true
  },

  onchange: function (this: IfReturnBlock) {
    if (this.workspace.isDragging()) {
      return
    }
    let legal = false
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let block = this
    do {
      if (this.FUNCTION_TYPES.includes(block.type)) {
        legal = true
        break
      }
      block = block.getSurroundParent()!
    } while (block)
    if (legal) {
      if (block.type === 'procedures_defnoreturn' && this.hasReturnValue_) {
        this.removeInput('VALUE')
        this.appendDummyInput('VALUE').appendField(
          Msg['PROCEDURES_DEFRETURN_RETURN']
        )
        this.hasReturnValue_ = false
      } else if (
        block.type === 'procedures_defreturn' &&
        !this.hasReturnValue_
      ) {
        this.removeInput('VALUE')
        const valueInput = this.appendValueInput('VALUE').appendField(
          Msg['PROCEDURES_DEFRETURN_RETURN']
        )

        // Add math_number as empty return value
        valueInput.connection?.setShadowState({
          type: 'input',
          fields: { VALUE: '' }
        })

        this.hasReturnValue_ = true
      }
      this.setWarningText(null)
    } else {
      this.setWarningText(Msg['PROCEDURES_IFRETURN_WARNING'])
    }

    if (!this.isInFlyout) {
      this.setDisabledReason(!legal, 'UNPARENTED_IFRETURN')
    }
  },
  FUNCTION_TYPES: ['procedures_defnoreturn', 'procedures_defreturn']
}
