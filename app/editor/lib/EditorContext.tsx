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
import {
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

interface EditorContextType {
  // REFS
  runState: RefObject<RunState>
  funcEnv: RefObject<FuncEnv>
  varEnv: RefObject<VarEnv>
  scene: RefObject<Scene>
  modelScene: RefObject<Scene>
  canvas: RefObject<HTMLCanvasElement>
  orbitControls: RefObject<OrbitControls | null>

  /** @todo should be a ref */
  camera: PerspectiveCamera | OrthographicCamera | null

  // UI STATE
  workspace: WorkspaceSvg | null
  currentObject: Object3D | null
  isRunning: boolean
  objectVersion: number
  shouldLoad: boolean
  setCamera: Dispatch<PerspectiveCamera | OrthographicCamera | null>
  setShouldLoad: Dispatch<SetStateAction<boolean>>
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
  const modelScene = useRef(new Scene())
  const orbitControls = useRef(null)
  const canvas = useRef<HTMLCanvasElement>(null!)
  const runState = useRef<RunState>({
    shouldRun: false,
    shouldPause: false,
    shouldStop: false,
    shouldStep: false
  })

  /** should be a ref */
  const [camera, setCamera] = useState<
    PerspectiveCamera | OrthographicCamera | null
  >(null)

  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)
  const [currentObject, setCurrentObject] = useState<Object3D | null>(null)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [objectVersion, setObjectVersion] = useState(0)
  const [shouldLoad, setShouldLoad] = useState(true)

  return (
    <EditorContext.Provider
      value={{
        funcEnv,
        varEnv,
        scene,
        camera,
        canvas,
        orbitControls,
        modelScene,
        runState,

        workspace,
        currentObject,
        isRunning,
        objectVersion,
        shouldLoad,
        setCamera,
        setShouldLoad,
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
