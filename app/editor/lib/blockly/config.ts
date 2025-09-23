import {
  blockRendering,
  common,
  ContextMenuItems,
  Extensions,
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
import { GrapletRenderer } from './renderer'
import { definitions } from './blocks'
import {
  isDivisibleMutatorMixin,
  isDivisibleMutatorExtension
} from './mutators/isDivisible'
import { unregisterProcedureBlocks } from '@blockly/block-shareable-procedures'
import { procedureBlocks } from './procedures.test'

export function initializeBlockly() {
  Extensions.unregister('math_is_divisibleby_mutator')
  Extensions.registerMutator(
    'math_is_divisibleby_mutator',
    isDivisibleMutatorMixin,
    isDivisibleMutatorExtension
  )
  
  unregisterProcedureBlocks()
  common.defineBlocks(procedureBlocks)

  Scrollbar.scrollbarThickness = 10
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
