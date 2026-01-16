import React, {
  createContext,
  RefObject,
  useContext,
  useRef,
  useState
} from 'react'
import { WorkspaceSvg } from 'blockly'
import { RunState, FuncEnv, VarEnv } from './blockly/engine/ast'
import { Camera, Object3D, Scene } from 'three'
import {
  OrbitControls,
  TransformControls,
  TransformControlsMode
} from 'three/examples/jsm/Addons.js'
import { ContextMenuProps, NotificationItemProps, StateFunc } from './types'
import { DockviewApi } from 'dockview-react'

interface EditorContextType {
  // REFS
  runState: RefObject<RunState>
  funcEnv: RefObject<FuncEnv>
  varEnv: RefObject<VarEnv>
  scene: RefObject<Scene>
  objects: RefObject<Map<string, Object3D>>
  objectIds: RefObject<WeakMap<Object3D, string>>
  modelScene: RefObject<Scene>
  canvas: RefObject<HTMLCanvasElement>
  controls: RefObject<TransformControls | null>
  orbitMap: RefObject<Map<number, OrbitControls | null>>

  // UI VERSIONS
  objectVersion: number
  treeVersion: number
  setObjectVersion: StateFunc<number>
  setTreeVersion: StateFunc<number>

  // UI STATE
  notifications: NotificationItemProps[]
  camera: Camera | null
  workspace: WorkspaceSvg | null
  selectedItems: string[]
  currentTool: TransformControlsMode
  isRunning: boolean
  shouldLoad: boolean
  contextMenu: ContextMenuProps | null
  dvApi: DockviewApi | null
  currentTheme: string
  setNotifications: StateFunc<NotificationItemProps[]>
  setCurrentTheme: StateFunc<string>
  setDvApi: StateFunc<DockviewApi | null>
  setContextMenu: StateFunc<ContextMenuProps | null>
  setCamera: StateFunc<Camera | null>
  setShouldLoad: StateFunc<boolean>
  setWorkspace: StateFunc<WorkspaceSvg | null>
  setSelectedItems: StateFunc<string[]>
  setCurrentTool: StateFunc<TransformControlsMode>
  setIsRunning: StateFunc<boolean>
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
  const objects = useRef(new Map())
  const objectIds = useRef<WeakMap<Object3D, string>>(new WeakMap())
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

  const [objectVersion, setObjectVersion] = useState(0)
  const [treeVersion, setTreeVersion] = useState(0)

  const [camera, setCamera] = useState<Camera | null>(null)
  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)
  const [currentTool, setCurrentTool] =
    useState<TransformControlsMode>('translate')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [shouldLoad, setShouldLoad] = useState(true)
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null)
  const [dvApi, setDvApi] = useState<DockviewApi | null>(null)
  const [currentTheme, setCurrentTheme] = useState<string>('')
  const [notifications, setNotifications] = useState<NotificationItemProps[]>(
    []
  )
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  return (
    <EditorContext.Provider
      value={{
        funcEnv,
        varEnv,
        scene,
        objects,
        objectIds,
        orbitMap,
        canvas,
        modelScene,
        runState,
        controls,

        objectVersion,
        treeVersion,
        setObjectVersion,
        setTreeVersion,

        notifications,
        camera,
        workspace,
        selectedItems,
        currentTool,
        isRunning,
        shouldLoad,
        contextMenu,
        dvApi,
        currentTheme,
        setNotifications,
        setCurrentTheme,
        setDvApi,
        setContextMenu,
        setCamera,
        setShouldLoad,
        setWorkspace,
        setSelectedItems,
        setCurrentTool,
        setIsRunning
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
