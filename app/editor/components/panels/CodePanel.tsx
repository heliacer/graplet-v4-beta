import "@/app/editor/styles/blockly.css"
import { definitions } from "../../lib/blockly/blocks"
import { common, WorkspaceSvg } from "blockly"
import { useEffect, useRef } from "react"
import { useEditor } from "../../lib/EditorContext"
import { blocklyOptions } from "../../lib/blockly/options"
import { initializeWorkspace, resize } from "../../lib/blockly/initializeWorkspace"

common.defineBlocks(definitions)

export default function CodePanel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const WorkspaceRef = useRef<WorkspaceSvg | null>(null)
  const { setWorkspace } = useEditor()

  useEffect(() => {
    if (!containerRef.current || WorkspaceRef.current) return

    const ws = initializeWorkspace(containerRef.current, blocklyOptions)
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
    <div ref={containerRef} className="w-full h-full overflow-hidden" />
  )
}
