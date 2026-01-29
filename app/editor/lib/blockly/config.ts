import {
  blockRendering,
  common,
  ContextMenuItems,
  Extensions,
  Options,
  registry,
  Toolbox,
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
import './blocks/'
import {
  isDivisibleMutatorMixin,
  isDivisibleMutatorExtension
} from './extensions/divisibleBy'
import { GrapletRenderer } from './renderer'
import {
  blocks as defaultFunctionBlocks,
  unregisterProcedureBlocks,
  registerProcedureSerializer
} from '@blockly/block-shareable-procedures'
import { functionsCategory } from './categories/functions'

/**
 * @todo refactor
 */

class ContinuousIconCategory extends ContinuousCategory {
  override createIconDom_(): Element {
    const icon = document.createElement('div')
    icon.classList.add('categoryBubble')
    icon.classList.add(this.name_)
    icon.style.backgroundColor = this.colour_
    return icon
  }
}

class CompactContinuousFlyout extends ContinuousFlyout {
  GAP_Y: number
  constructor(options: Options) {
    super(options)
    this.GAP_Y = 20
  }
}

export class ContinuousClosableMetrics extends ContinuousMetrics {
  override getViewMetrics(getWorkspaceCoordinates = false) {
    const metrics = super.getViewMetrics(getWorkspaceCoordinates)
    const flyoutMetrics = this.getFlyoutMetrics(false)
    const scale = getWorkspaceCoordinates ? this.workspace_.scale : 1
    metrics.width += flyoutMetrics.width / scale
    return metrics
  }

  override getAbsoluteMetrics() {
    const abs = super.getAbsoluteMetrics()
    const flyoutMetrics = this.getFlyoutMetrics(false)
    abs.left -= flyoutMetrics.width
    return abs
  }
}

export function initializeBlockly() {
  registerProcedureSerializer()

  Extensions.unregister('math_is_divisibleby_mutator')
  Extensions.registerMutator(
    'math_is_divisibleby_mutator',
    isDivisibleMutatorMixin,
    isDivisibleMutatorExtension
  )

  unregisterProcedureBlocks()

  /**
   * @todo For now built in, but later use custom function blocks.
   *
   * Includes:
   * -> custom mutator: block editor mechanism, with custom model, etc.
   * -> draggable param blocks, similar to MIT's Scratch 3.
   *
   * (part of local param migration)
   */
  common.defineBlocks(defaultFunctionBlocks)

  /* register dynamic categories before injection (sneaky) */
  const sourceToolboxInit = Toolbox.prototype.init
  Toolbox.prototype.init = function () {
    this.workspace_.registerToolboxCategoryCallback(
      'FUNCTIONS',
      functionsCategory
    )
    sourceToolboxInit.call(this)
  }

  blockRendering.register('graplet', GrapletRenderer)
  VerticalFlyout.prototype.getFlyoutScale = function () {
    if (common.getMainWorkspace()?.id === this.getTargetWorkspace().id) {
      return 0.8
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
    ContinuousClosableMetrics,
    true
  )

  registry.register(
    registry.Type.FLYOUTS_VERTICAL_TOOLBOX,
    'ContinuousFlyout',
    CompactContinuousFlyout,
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
