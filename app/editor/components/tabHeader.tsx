import { DockviewDefaultTab, IDockviewPanelHeaderProps } from "dockview-react"
import { Star } from "lucide-react"
import { JSX } from "react"

type TabParams = { Icon: JSX.Element, closable: boolean }

export default function TabHeader(props: IDockviewPanelHeaderProps<TabParams>) {
  return (
    <div className="flex items-center py-0.5 px-2 gap-1">
      {props.params.Icon || <Star size={16} />}
      <DockviewDefaultTab hideClose={!props.params.closable} {...props} />
    </div>
  )
}
