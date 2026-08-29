import React, { createContext, RefObject, useContext, useRef } from 'react'
import { WorkspaceSvg } from 'blockly'
import { FuncEnv, VarEnv } from '../engine/ast'
import { Object3D, PerspectiveCamera } from 'three'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

interface EditorContextType {
  funcEnvRef: RefObject<FuncEnv>
  varEnvRef: RefObject<VarEnv>
  objectsRef: RefObject<Map<string, Object3D>>
  cameraRef: RefObject<PerspectiveCamera | null>
  canvasRef: RefObject<HTMLCanvasElement>
  controlsRef: RefObject<TransformControls | null>
  orbitMapRef: RefObject<Map<number, OrbitControls>>
  workspaceRef: RefObject<WorkspaceSvg | null>
  stepsPerFrameRef: RefObject<number>
  nextSharedIdRef: RefObject<number>
}

const EditorContext = createContext<EditorContextType>(null!)

export function useEditorRefs() {
  return useContext(EditorContext)
}

export function EditorProvider({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const varEnvRef = useRef<VarEnv>(new Map())
  const funcEnvRef = useRef<FuncEnv>(new Map())
  const objectsRef = useRef(new Map())
  const cameraRef = useRef(null)
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const controlsRef = useRef<TransformControls | null>(null)
  const orbitMapRef = useRef(new Map())
  const workspaceRef = useRef<WorkspaceSvg | null>(null)
  const stepsPerFrameRef = useRef<number>(100)
  const nextSharedIdRef = useRef(0)

  return (
    <EditorContext.Provider
      value={{
        funcEnvRef,
        varEnvRef,
        objectsRef,
        cameraRef,
        orbitMapRef,
        canvasRef,
        controlsRef,
        workspaceRef,
        stepsPerFrameRef,
        nextSharedIdRef
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
