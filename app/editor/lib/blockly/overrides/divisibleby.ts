import { FieldDropdown, Block } from 'blockly'

/**
 * @override "divisible by" option mutator mixin
 */

interface DivisiblebyBlock extends Block {
  updateShape_: (divisorInput: boolean) => void
}

export const isDivisibleMutatorMixin = {
  saveExtraState: function (this: Block) {
    return {
      divisorInput: this.getFieldValue('PROPERTY') === 'DIVISIBLE_BY'
    }
  },

  loadExtraState: function (
    this: DivisiblebyBlock,
    state: { divisorInput: boolean }
  ) {
    this.updateShape_(state['divisorInput'])
  },

  updateShape_: function (this: DivisiblebyBlock, divisorInput: boolean) {
    const input = this.getInput('DIVISOR')

    if (divisorInput) {
      if (!input) {
        const newInput = this.appendValueInput('DIVISOR').setCheck('Number')
        newInput.connection?.setShadowState({
          type: 'math_number',
          fields: { NUM: 2 }
        })
      }
    } else if (input) {
      input.connection?.setShadowState(null)
      this.removeInput('DIVISOR')
    }
  }
}

export const isDivisibleMutatorExtension = function (this: DivisiblebyBlock) {
  this.getField('PROPERTY')!.setValidator(function (
    this: FieldDropdown,
    option: string
  ) {
    const divisorInput = option === 'DIVISIBLE_BY'
    const sourceBlock = this.getSourceBlock() as DivisiblebyBlock
    sourceBlock.updateShape_(divisorInput)
    return undefined
  })
}
