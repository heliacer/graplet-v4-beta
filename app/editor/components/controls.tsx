import { IDockviewHeaderActionsProps } from "dockview-react"
import { useHeaderControls } from "../hooks/useHeaderControls"
import { Maximize, Minimize, Plus, SquareArrowOutDownLeft, SquareArrowOutUpRight } from "lucide-react"

export function RightControls(props: IDockviewHeaderActionsProps) {
  const { isMaximised, isFloating, toggleMaximized, toggleFloating } = useHeaderControls(props)

  return (
    <nav className="flex items-center gap-1 px-1 h-full">
      <button
        className="p-0.5 border border-transparent hover:border-zinc-700 hover:bg-zinc-800 rounded cursor-pointer"
        onClick={toggleFloating}
      >
        {isFloating ? <SquareArrowOutDownLeft size={16} /> : <SquareArrowOutUpRight size={16} />}
      </button>
      <button
        className="p-0.5 border border-transparent hover:border-zinc-700 hover:bg-zinc-800 rounded cursor-pointer"
        onClick={toggleMaximized}
      >
        {isMaximised ? <Minimize size={16} /> : <Maximize size={16} />}
      </button>
    </nav>
  )
}

export function LeftControls(props: IDockviewHeaderActionsProps) {
  function addNew() {
    props.containerApi.addPanel({
      id: crypto.randomUUID(),
      component: 'debug',
      title: `New`,
      position: {
        referenceGroup: props.group,
      },
      params: {
        closable: true
      }
    })
  }

  return (
    <nav className="flex items-center gap-1 px-1 h-full">
      <button
        className="p-0.5 border border-transparent hover:border-zinc-700 hover:bg-zinc-800 rounded cursor-pointer"
        onClick={addNew}
      >
        <Plus size={16} />
      </button>
    </nav>
  )
}