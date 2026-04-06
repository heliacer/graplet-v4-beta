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
import { OrbitControls, TransformControls } from 'three/examples/jsm/Addons.js'
import { ContextMenuProps, StateFunc } from './types'

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
  workspace: RefObject<WorkspaceSvg | null>

  // UI STATE
  camera: Camera | null
  shouldLoad: boolean
  contextMenu: ContextMenuProps | null
  objectVersion: number
  setObjectVersion: StateFunc<number>
  setContextMenu: StateFunc<ContextMenuProps | null>
  setCamera: StateFunc<Camera | null>
  setShouldLoad: StateFunc<boolean>
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
  const workspace = useRef<WorkspaceSvg | null>(null)

  const [objectVersion, setObjectVersion] = useState(0)
  const [camera, setCamera] = useState<Camera | null>(null)
  const [shouldLoad, setShouldLoad] = useState(true)
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null)

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
        workspace,

        camera,
        objectVersion,
        shouldLoad,
        contextMenu,
        setObjectVersion,
        setContextMenu,
        setCamera,
        setShouldLoad
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
