import { DockviewDefaultTab, IDockviewPanelHeaderProps } from 'dockview-react'
import { IconT, ItemIcon } from '../lib/utils/icons'
import { Star } from 'lucide-react'

type TabParams = { iconType?: IconT; closable: boolean }

export default function TabHeader(props: IDockviewPanelHeaderProps<TabParams>) {
  const { iconType } = props.params

  return (
    <div className="flex items-center py-0.5 px-2 gap-1">
      {iconType ? (
        <ItemIcon size={14} iconType={iconType} />
      ) : (
        <Star size={14} />
      )}
      <DockviewDefaultTab hideClose={!props.params.closable} {...props} />
    </div>
  )
}
