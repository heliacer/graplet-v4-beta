import React, { createContext, RefObject, useContext, useRef, useState } from "react"
import { WorkspaceSvg } from "blockly"
import { ObjectsRecord } from "./types"

interface EditorContextType {
  workspace: WorkspaceSvg | null
  setWorkspace: (workspace: WorkspaceSvg | null) => void
  objects: RefObject<ObjectsRecord>
}

const EditorContext = createContext<EditorContextType>(null!)

export function useEditor() {
  return useContext(EditorContext)
}

export function EditorProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)
  const objects = useRef(new Map())
  
  return (
    <EditorContext.Provider value={{ workspace, setWorkspace, objects}}>
      {children}
    </EditorContext.Provider>
  )
}
