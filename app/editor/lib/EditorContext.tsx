import React, {
  createContext,
  RefObject,
  Dispatch,
  useContext,
  SetStateAction,
  useRef,
  useState
} from 'react'
import { WorkspaceSvg } from 'blockly'
import { ObjectsEnv, RunState } from './types'

interface EditorContextType {
  workspace: WorkspaceSvg | null
  setWorkspace: Dispatch<SetStateAction<WorkspaceSvg | null>>
  objects: RefObject<ObjectsEnv>
  currentObject: string
  setCurrentObject: Dispatch<SetStateAction<string>>
  runState: RefObject<RunState>
  isRunning: boolean
  setIsRunning: Dispatch<SetStateAction<boolean>>
}

const EditorContext = createContext<EditorContextType>(null!)

export function useEditor() {
  return useContext(EditorContext)
}

export function EditorProvider({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)
  const [currentObject, setCurrentObject] = useState<string>('')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const objects = useRef(new Map())
  const runState = useRef<RunState>({
    shouldRun: false,
    shouldPause: false,
    shouldStop: false,
    shouldStep: false
  })

  return (
    <EditorContext.Provider
      value={{
        workspace,
        setWorkspace,
        objects,
        currentObject,
        setCurrentObject,
        runState,
        isRunning,
        setIsRunning
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
