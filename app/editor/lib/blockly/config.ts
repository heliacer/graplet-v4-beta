import {
  blockRendering,
  common,
  ContextMenuItems,
  Extensions,
  registry,
  Scrollbar,
  ToolboxCategory,
  VerticalFlyout,
  Blocks
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
import {
  isDivisibleMutatorMixin,
  isDivisibleMutatorExtension
} from './mutators/isDivisible'
import { PROCEDURES_IFRETURN } from './mutators/ifReturn'
import {
  PROCEDURES_CALLRETURN,
  PROCEDURES_CALLNORETURN
} from './mutators/procedures'

// TODO: Override ifreturn mutator mixins

export function initializeBlockly() {
  Extensions.unregister('math_is_divisibleby_mutator')
  Extensions.registerMutator(
    'math_is_divisibleby_mutator',
    isDivisibleMutatorMixin,
    isDivisibleMutatorExtension
  )

  Blocks['procedures_ifreturn'] = PROCEDURES_IFRETURN
  Blocks['procedures_callnoreturn'] = PROCEDURES_CALLNORETURN
  Blocks['procedures_callreturn'] = PROCEDURES_CALLRETURN

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
