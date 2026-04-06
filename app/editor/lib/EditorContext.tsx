import React, {
  createContext,
  RefObject,
  useContext,
  useRef,
  useState
} from 'react'
import { WorkspaceSvg } from 'blockly'
import { FuncEnv, VarEnv } from './blockly/engine/ast'
import { Camera, Object3D, Scene } from 'three'
import {
  OrbitControls,
  TransformControls,
} from 'three/examples/jsm/Addons.js'
import {
  ContextMenuProps,
  NotificationItemProps,
  StateFunc,
} from './types'
import { DockviewApi } from 'dockview-react'

interface EditorContextType {
  // REFS
  funcEnv: RefObject<FuncEnv>
  varEnv: RefObject<VarEnv>
  scene: RefObject<Scene>
  objects: RefObject<Map<string, Object3D>>
  modelScene: RefObject<Scene>
  canvas: RefObject<HTMLCanvasElement>
  controls: RefObject<TransformControls | null>
  orbitMap: RefObject<Map<number, OrbitControls | null>>

  // UI STATE
  notifications: NotificationItemProps[]
  camera: Camera | null
  workspace: WorkspaceSvg | null
  selectedItems: string[]
  shouldLoad: boolean
  contextMenu: ContextMenuProps | null
  dvApi: DockviewApi | null
  objectVersion: number
  setNotifications: StateFunc<NotificationItemProps[]>
  setObjectVersion: StateFunc<number>
  setDvApi: StateFunc<DockviewApi | null>
  setContextMenu: StateFunc<ContextMenuProps | null>
  setCamera: StateFunc<Camera | null>
  setShouldLoad: StateFunc<boolean>
  setWorkspace: StateFunc<WorkspaceSvg | null>
  setSelectedItems: StateFunc<string[]>
}

const EditorContext = createContext<EditorContextType>(null!)

export function useOldEditor() {
  return useContext(EditorContext)
}

export function EditorProvider({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const varEnv = useRef<VarEnv>(new Map())
  const funcEnv = useRef<FuncEnv>(new Map())
  const scene = useRef(new Scene())
  const objects = useRef(new Map())
  const modelScene = useRef(new Scene())
  const canvas = useRef<HTMLCanvasElement>(null!)
  const controls = useRef<TransformControls | null>(null)
  const orbitMap = useRef(new Map())

  const [objectVersion, setObjectVersion] = useState(0)

  const [camera, setCamera] = useState<Camera | null>(null)
  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null)
  const [shouldLoad, setShouldLoad] = useState(true)
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null)
  const [dvApi, setDvApi] = useState<DockviewApi | null>(null)
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
        orbitMap,
        canvas,
        modelScene,
        controls,

        notifications,
        camera,
        objectVersion,
        workspace,
        selectedItems,
        shouldLoad,
        contextMenu,
        dvApi,
        setNotifications,
        setObjectVersion,
        setDvApi,
        setContextMenu,
        setCamera,
        setShouldLoad,
        setWorkspace,
        setSelectedItems,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
