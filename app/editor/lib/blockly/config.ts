import {
  Block,
  blockRendering,
  common,
  ContextMenuItems,
  Extensions,
  FieldDropdown,
  registry,
  Scrollbar,
  ToolboxCategory,
  VerticalFlyout
} from 'blockly'
import {
  ContinuousCategory,
  ContinuousFlyout,
  ContinuousMetrics,
  ContinuousToolbox,
  RecyclableBlockFlyoutInflater
} from '@blockly/continuous-toolbox'
import { registerFieldAngle } from '@blockly/field-angle'
import { GrapletRenderer } from './renderer'
import { definitions } from './blocks'

interface DivisiblebyBlock extends Block {
  updateShape_: (divisorInput: boolean) => void
}

const IS_DIVISIBLEBY_MUTATOR_MIXIN = {
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

const IS_DIVISIBLE_MUTATOR_EXTENSION = function (this: DivisiblebyBlock) {
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

// TODO: Override ifreturn mutator mixins

export function initializeBlockly() {
  Extensions.unregister('math_is_divisibleby_mutator')
  Extensions.registerMutator(
    'math_is_divisibleby_mutator',
    IS_DIVISIBLEBY_MUTATOR_MIXIN,
    IS_DIVISIBLE_MUTATOR_EXTENSION
  )

  Scrollbar.scrollbarThickness = 10
  registerFieldAngle()
  common.defineBlocks(definitions)
  VerticalFlyout.prototype.getFlyoutScale = function () {
    return 0.45
  }
  blockRendering.register('graplet', GrapletRenderer)

  registry.register(
    registry.Type.TOOLBOX_ITEM,
    ToolboxCategory.registrationName,
    ContinuousCategory,
    true
  )

  registry.register(
    registry.Type.METRICS_MANAGER,
    'ContinuousMetrics',
    ContinuousMetrics,
    true
  )

  registry.register(
    registry.Type.FLYOUTS_VERTICAL_TOOLBOX,
    'ContinuousFlyout',
    ContinuousFlyout,
    true
  )

  registry.register(
    registry.Type.TOOLBOX,
    'ContinuousToolbox',
    ContinuousToolbox,
    true
  )

  registry.register(
    registry.Type.FLYOUT_INFLATER,
    'block',
    RecyclableBlockFlyoutInflater,
    true
  )

  ContextMenuItems.registerCommentOptions()
}
