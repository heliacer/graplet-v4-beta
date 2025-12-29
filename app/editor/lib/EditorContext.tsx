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
import { Camera, Object3D, OrthographicCamera, PerspectiveCamera, Scene } from 'three'
import {
  OrbitControls,
  TransformControls,
  TransformControlsMode
} from 'three/examples/jsm/Addons.js'
import { ContextMenuProps } from './types'
import { DockviewApi } from 'dockview-react'

/** 
 * @majortodo
 * CLEANUP: try to use less context values and access more directly
 */

interface EditorContextType {
  // REFS
  runState: RefObject<RunState>
  funcEnv: RefObject<FuncEnv>
  varEnv: RefObject<VarEnv>
  scene: RefObject<Scene>
  modelScene: RefObject<Scene>
  canvas: RefObject<HTMLCanvasElement>
  controls: RefObject<TransformControls | null>
  orbitMap: RefObject<Map<number, OrbitControls | null>>
  
  // UI STATE
  camera: Camera | null
  workspace: WorkspaceSvg | null
  currentObject: Object3D | null
  currentTool: TransformControlsMode
  isRunning: boolean
  objectVersion: number
  shouldLoad: boolean
  contextMenu: ContextMenuProps | null
  dvApi: DockviewApi | null
  setDvApi: Dispatch<DockviewApi | null>
  setContextMenu: Dispatch<ContextMenuProps | null>
  setCamera: Dispatch<Camera | null>
  setShouldLoad: Dispatch<SetStateAction<boolean>>
  setObjectVersion: Dispatch<SetStateAction<number>>
  setWorkspace: Dispatch<SetStateAction<WorkspaceSvg | null>>
  setCurrentObject: Dispatch<SetStateAction<Object3D | null>>
  setCurrentTool: Dispatch<SetStateAction<TransformControlsMode>>
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
  const canvas = useRef<HTMLCanvasElement>(null!)
  const controls = useRef<TransformControls | null>(null)
  const orbitMap = useRef(new Map())
  const runState = useRef<RunState>({
    shouldRun: false,
    shouldPause: false,
    shouldStop: false,
    shouldStep: false
  })

  const [camera, setCamera] = useState<Camera | null>(null)
  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)
  const [currentObject, setCurrentObject] = useState<Object3D | null>(null)
  const [currentTool, setCurrentTool] =
    useState<TransformControlsMode>('translate')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [objectVersion, setObjectVersion] = useState(0)
  const [shouldLoad, setShouldLoad] = useState(true)
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null)
  const [dvApi, setDvApi] = useState<DockviewApi | null>(null)

  return (
    <EditorContext.Provider
      value={{
        funcEnv,
        varEnv,
        scene,
        orbitMap,
        canvas,
        modelScene,
        runState,
        controls,
        camera,

        workspace,
        currentObject,
        currentTool,
        isRunning,
        objectVersion,
        shouldLoad,
        contextMenu,
        dvApi,
        setDvApi,
        setContextMenu,
        setCamera,
        setShouldLoad,
        setObjectVersion,
        setWorkspace,
        setCurrentObject,
        setCurrentTool,
        setIsRunning
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
