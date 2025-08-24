import React, { createContext, RefObject, useContext, useRef, useState } from "react"
import { WorkspaceSvg } from "blockly"
import { Object3D, Object3DEventMap } from "three"

interface EditorContextType {
  workspace: WorkspaceSvg | null
  objects: RefObject<Map<string, Object3D<Object3DEventMap>>>
  setWorkspace: (workspace: WorkspaceSvg | null) => void
}

const EditorContext = createContext<EditorContextType>(null!)

export function useEditor() {
  return useContext(EditorContext)
}

export function EditorProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)
  const objects = useRef(new Map<string, Object3D<Object3DEventMap>>())
  
  return (
    <EditorContext.Provider value={{ workspace, objects, setWorkspace }}>
      {children}
    </EditorContext.Provider>
  )
}
