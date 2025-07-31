import "@/app/editor/styles/blockly.css"
import { definitions } from "../../lib/blockly/blocks"
import { blockRendering, bumpObjects, common, ContextMenuItems, DropDownDiv, inject, registry, Scrollbar, ToolboxCategory, Tooltip, VerticalFlyout, WidgetDiv, WorkspaceSvg } from "blockly"
import { useEffect, useRef } from "react"
import { useEditor } from "../../lib/EditorContext"
import { blocklyOptions } from "../../lib/blockly/options"
import { ContinuousCategory, ContinuousFlyout, ContinuousMetrics, ContinuousToolbox, RecyclableBlockFlyoutInflater } from "@blockly/continuous-toolbox"
import { registerFieldAngle } from "@blockly/field-angle"
import { GrapletRenderer } from "../../lib/blockly/renderer"

Scrollbar.scrollbarThickness = 10
registerFieldAngle()
common.defineBlocks(definitions)
VerticalFlyout.prototype.getFlyoutScale = function() { return .45 }
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

function resize(workspace: WorkspaceSvg) {
  Tooltip.hide()
  workspace.hideComponents(true)
  DropDownDiv.repositionForWindowResize()
  WidgetDiv.repositionForWindowResize()
  common.svgResize(workspace)
  bumpObjects.bumpTopObjectsIntoBounds(workspace)
}

export default function CodePanel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const WorkspaceRef = useRef<WorkspaceSvg | null>(null)
  const { setWorkspace } = useEditor()

  useEffect(() => {
    if (!containerRef.current || WorkspaceRef.current) return

    const ws = inject(containerRef.current, blocklyOptions)
    WorkspaceRef.current = ws
    setWorkspace(ws)

    const resizeObserver = new ResizeObserver(() => resize(ws))
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      ws.dispose()
      WorkspaceRef.current = null
      setWorkspace(null)
    }
  }, [setWorkspace])

  return (
    <div ref={containerRef} className="w-full h-full" />
  )
}
