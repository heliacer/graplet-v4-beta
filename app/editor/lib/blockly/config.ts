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

/** @todo (#66) Blockly config: Refactor */

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
    this.autoClose = true
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
   * @todo (#14) Graplet Procedures
   *
   * For now use built in, but later the custom function blocks will be used.
   */
  common.defineBlocks(defaultFunctionBlocks)

  /* register dynamic categories before injection */
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
