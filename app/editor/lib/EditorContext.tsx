import React, { createContext, useContext, useState } from "react"
import { Action } from "./types"
import { WorkspaceSvg } from "blockly"

interface EditorContextType {
  workspace: WorkspaceSvg | null
  setWorkspace: (workspace: WorkspaceSvg | null) => void
  ir: Action[]
  setIr: (ir: Action[]) => void
  runScene: () => void
  runTrigger: number
}

const EditorContext = createContext<EditorContextType>(null!)

export function useEditor() {
  return useContext(EditorContext)
}

export function EditorProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)
  const [runTrigger, setRunTrigger] = useState<number>(0)
  const [ir, setIr] = useState<Action[]>([])
  const runScene = () => { setRunTrigger(v => v + 1) }

  return (
    <EditorContext.Provider value={{ workspace, setWorkspace, ir, setIr, runScene, runTrigger }}>
      {children}
    </EditorContext.Provider>
  )
}
