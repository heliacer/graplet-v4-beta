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
import { GrapletRenderer } from './renderer'

class ContinuousIconCategory extends ContinuousCategory {
  override createIconDom_(): Element {
    const icon = document.createElement('div')
    icon.classList.add('categoryBubble')
    icon.classList.add(this.name_)
    icon.style.backgroundColor = this.colour_
    return icon
  }
}

export function initializeBlockly() {
  Extensions.unregister('math_is_divisibleby_mutator')
  Extensions.registerMutator(
    'math_is_divisibleby_mutator',
    isDivisibleMutatorMixin,
    isDivisibleMutatorExtension
  )

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
    ContinuousIconCategory,
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
