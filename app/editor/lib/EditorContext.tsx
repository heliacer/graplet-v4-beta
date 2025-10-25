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
import { RunState, FuncEnv, VarEnv } from './blockly/engine/ast'
import { Object3D, OrthographicCamera, PerspectiveCamera, Scene } from 'three'

interface EditorContextType {
  // REFS
  runState: RefObject<RunState>
  funcEnv: RefObject<FuncEnv>
  varEnv: RefObject<VarEnv>
  scene: RefObject<Scene>
  camera: PerspectiveCamera | OrthographicCamera | undefined
  modelScene: RefObject<Scene>
  canvas: RefObject<HTMLCanvasElement | null>

  // UI STATE
  workspace: WorkspaceSvg | null
  currentObject: Object3D | null
  isRunning: boolean
  objectVersion: number
  shouldWorkspaceLoad: boolean
  shouldSceneLoad: boolean
  setCamera: Dispatch<PerspectiveCamera | OrthographicCamera | undefined>
  setShouldWorkspaceLoad: Dispatch<SetStateAction<boolean>>
  setShouldSceneLoad: Dispatch<SetStateAction<boolean>>
  setObjectVersion: Dispatch<SetStateAction<number>>
  setWorkspace: Dispatch<SetStateAction<WorkspaceSvg | null>>
  setCurrentObject: Dispatch<SetStateAction<Object3D | null>>
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
  const scene = useRef(new Scene())
  const [camera, setCamera] = useState<PerspectiveCamera | OrthographicCamera>()
  const modelScene = useRef(new Scene())
  const canvas = useRef<HTMLCanvasElement>(null)
  const runState = useRef<RunState>({
    shouldRun: false,
    shouldPause: false,
    shouldStop: false,
    shouldStep: false
  })

  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)
  const [currentObject, setCurrentObject] = useState<Object3D | null>(null)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [objectVersion, setObjectVersion] = useState(0)
  const [shouldWorkspaceLoad, setShouldWorkspaceLoad] = useState(true)
  const [shouldSceneLoad, setShouldSceneLoad] = useState(true)

  return (
    <EditorContext.Provider
      value={{
        funcEnv,
        varEnv,
        scene,
        camera,
        canvas,
        modelScene,
        runState,

        workspace,
        currentObject,
        isRunning,
        objectVersion,
        shouldWorkspaceLoad,
        shouldSceneLoad,
        setCamera,
        setShouldWorkspaceLoad,
        setShouldSceneLoad,
        setObjectVersion,
        setWorkspace,
        setCurrentObject,
        setIsRunning
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
