import {
  blockRendering,
  common,
  ContextMenuItems,
  Extensions,
  registry,
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
import { definitions } from './blocks'
import {
  isDivisibleMutatorMixin,
  isDivisibleMutatorExtension
} from './overrides/divisibleby'
import { procedureBlocks } from './overrides/procedures'
import { GrapletRenderer } from './renderer'

export function initializeBlockly() {
  Extensions.unregister('math_is_divisibleby_mutator')
  Extensions.registerMutator(
    'math_is_divisibleby_mutator',
    isDivisibleMutatorMixin,
    isDivisibleMutatorExtension
  )

  common.defineBlocks(procedureBlocks)
  common.defineBlocks(definitions)

  blockRendering.register('graplet', GrapletRenderer)
  VerticalFlyout.prototype.getFlyoutScale = function () {
    if (common.getMainWorkspace()?.id === this.getTargetWorkspace().id) {
      return 0.45
    } else {
      return this.getTargetWorkspace().scale
    }
  }

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
