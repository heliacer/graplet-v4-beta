import { registry, ToolboxCategory } from "blockly"
import { CompactContinuousFlyout, ContinuousClosableMetrics, ContinuousIconCategory } from "../../types"
import { ContinuousToolbox, RecyclableBlockFlyoutInflater } from "@blockly/continuous-toolbox"

export function registerContinuousToolbox() {
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
}
