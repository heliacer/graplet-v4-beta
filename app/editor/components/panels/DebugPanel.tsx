'use client'

import { IDockviewPanelProps } from "dockview-react"

export default function DebugPanel(props: IDockviewPanelProps) {
  return (
    <div className="m-4 overflow-auto">
      <p className="italic">Prototype</p>
      <p>ID: {props.api.id}</p>
    </div>
  )
}