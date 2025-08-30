import { blockRendering, common, ContextMenuItems, registry, Scrollbar, ToolboxCategory, VerticalFlyout } from "blockly"
import { ContinuousCategory, ContinuousFlyout, ContinuousMetrics, ContinuousToolbox, RecyclableBlockFlyoutInflater } from "@blockly/continuous-toolbox"
import { registerFieldAngle } from "@blockly/field-angle"
import { GrapletRenderer } from "./renderer"
import { definitions } from "./blocks"

export function initializeBlockly() {
  Scrollbar.scrollbarThickness = 10
  registerFieldAngle()
  common.defineBlocks(definitions)
  VerticalFlyout.prototype.getFlyoutScale = function () { return .45 }
  blockRendering.register('graplet', GrapletRenderer)

  registry.register(
    registry.Type.TOOLBOX_ITEM,
    ToolboxCategory.registrationName,
    ContinuousCategory,
    true,
  )

  registry.register(
    registry.Type.METRICS_MANAGER,
    'ContinuousMetrics',
    ContinuousMetrics,
    true,
  )

  registry.register(
    registry.Type.FLYOUTS_VERTICAL_TOOLBOX,
    'ContinuousFlyout',
    ContinuousFlyout,
    true,
  )

  registry.register(
    registry.Type.TOOLBOX,
    'ContinuousToolbox',
    ContinuousToolbox,
    true,
  )

  registry.register(
    registry.Type.FLYOUT_INFLATER,
    'block',
    RecyclableBlockFlyoutInflater,
    true,
  )

  ContextMenuItems.registerCommentOptions()
}