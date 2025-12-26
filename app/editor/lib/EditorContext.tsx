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
import {
  OrbitControls,
  TransformControls,
  TransformControlsMode
} from 'three/examples/jsm/Addons.js'
import { ContextMenuProps } from './types'
import { DockviewApi } from 'dockview-react'

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

  /** @todo should be a ref (maybe) */
  camera: PerspectiveCamera | OrthographicCamera | null

  // UI STATE
  workspace: WorkspaceSvg | null

  translationSnap: number
  rotationSnap: number
  scaleSnap: number
  currentObject: Object3D | null
  currentTool: TransformControlsMode
  isRunning: boolean
  objectVersion: number
  shouldLoad: boolean
  contextMenu: ContextMenuProps | null
  dvApi: DockviewApi | null
  setTranslationSnap: Dispatch<number>
  setRotationSnap: Dispatch<number>
  setScaleSnap: Dispatch<number>
  setDvApi: Dispatch<DockviewApi | null>
  setContextMenu: Dispatch<ContextMenuProps | null>
  setCamera: Dispatch<PerspectiveCamera | OrthographicCamera | null>
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

  /** @todo should be a ref */
  const [camera, setCamera] = useState<
    PerspectiveCamera | OrthographicCamera | null
  >(null)

  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)
  const [currentObject, setCurrentObject] = useState<Object3D | null>(null)
  const [currentTool, setCurrentTool] =
    useState<TransformControlsMode>('translate')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [objectVersion, setObjectVersion] = useState(0)
  const [shouldLoad, setShouldLoad] = useState(true)
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null)
  const [dvApi, setDvApi] = useState<DockviewApi | null>(null)
  const [translationSnap, setTranslationSnap] = useState(0.5)
  const [rotationSnap, setRotationSnap] = useState(45) // degrees
  const [scaleSnap, setScaleSnap] = useState(0.5)

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
        translationSnap,
        rotationSnap,
        scaleSnap,
        setTranslationSnap,
        setRotationSnap,
        setScaleSnap,
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
