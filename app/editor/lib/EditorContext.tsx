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
import { ObjectsEnv, RunState, FuncEnv, VarEnv } from './blockly/ast'
import { Scene } from 'three'

interface EditorContextType {
  // REFS
  objects: RefObject<ObjectsEnv>
  runState: RefObject<RunState>
  funcEnv: RefObject<FuncEnv>
  varEnv: RefObject<VarEnv>
  scene: RefObject<Scene>

  // UI STATE
  workspace: WorkspaceSvg | null
  currentObject: string
  isRunning: boolean
  objectNames: string[]
  objectVersion: number
  shouldWorkspaceLoad: boolean
  shouldSceneLoad: boolean
  setShouldWorkspaceLoad: Dispatch<SetStateAction<boolean>>
  setShouldSceneLoad: Dispatch<SetStateAction<boolean>>
  setObjectVersion: Dispatch<SetStateAction<number>>
  setObjectNames: Dispatch<SetStateAction<string[]>>
  setWorkspace: Dispatch<SetStateAction<WorkspaceSvg | null>>
  setCurrentObject: Dispatch<SetStateAction<string>>
  setIsRunning: Dispatch<SetStateAction<boolean>>
}

const EditorContext = createContext<EditorContextType>(null!)

export function useEditor() {
  return useContext(EditorContext)
}

export function EditorProvider({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const varEnv = useRef<VarEnv>(new Map())
  const funcEnv = useRef<FuncEnv>(new Map())
  const objects = useRef(new Map())
  const scene = useRef(new Scene())
  const runState = useRef<RunState>({
    shouldRun: false,
    shouldPause: false,
    shouldStop: false,
    shouldStep: false
  })

  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)
  const [currentObject, setCurrentObject] = useState<string>('')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [objectNames, setObjectNames] = useState<Array<string>>([])
  const [objectVersion, setObjectVersion] = useState(0)
  const [shouldWorkspaceLoad, setShouldWorkspaceLoad] = useState(true)
  const [shouldSceneLoad, setShouldSceneLoad] = useState(true)

  return (
    <EditorContext.Provider
      value={{
        funcEnv,
        varEnv,
        objects,
        scene,
        runState,

        workspace,
        currentObject,
        isRunning,
        objectNames,
        objectVersion,
        shouldWorkspaceLoad,
        shouldSceneLoad,
        setShouldWorkspaceLoad,
        setShouldSceneLoad,
        setObjectVersion,
        setObjectNames,
        setWorkspace,
        setCurrentObject,
        setIsRunning
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
