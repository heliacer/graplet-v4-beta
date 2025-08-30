import { bumpObjects, common, DropDownDiv, Tooltip, WidgetDiv, WorkspaceSvg } from "blockly"

export function resize(workspace: WorkspaceSvg) {
  Tooltip.hide()
  workspace.hideComponents(true)
  DropDownDiv.repositionForWindowResize()
  WidgetDiv.repositionForWindowResize()
  common.svgResize(workspace)
  bumpObjects.bumpTopObjectsIntoBounds(workspace)
}