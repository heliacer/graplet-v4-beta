import React, { createContext, useContext, useState } from "react"
import { WorkspaceSvg } from "blockly"

interface EditorContextType {
  workspace: WorkspaceSvg | null
  setWorkspace: (workspace: WorkspaceSvg | null) => void
}

const EditorContext = createContext<EditorContextType>(null!)

export function useEditor() {
  return useContext(EditorContext)
}

export function EditorProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)

  return (
    <EditorContext.Provider value={{ workspace, setWorkspace }}>
      {children}
    </EditorContext.Provider>
  )
}
