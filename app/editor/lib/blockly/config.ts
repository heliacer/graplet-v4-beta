import {
  blockRendering,
  common,
  ContextMenuItems,
  Extensions,
  Scrollbar,
  Toolbox,
  VerticalFlyout
} from 'blockly'
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
import { registerContinuousToolbox } from './utils/registerContinuousToolbox'

export function initializeBlocklyConfig() {
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
  Scrollbar.scrollbarThickness = 12
  VerticalFlyout.prototype.getFlyoutScale = function () {
    if (common.getMainWorkspace()?.id === this.getTargetWorkspace().id) {
      return 0.8
    } else {
      return this.getTargetWorkspace().scale
    }
  }
  
  registerContinuousToolbox()
  blockRendering.register('graplet', GrapletRenderer)
  ContextMenuItems.registerCommentOptions()
}
