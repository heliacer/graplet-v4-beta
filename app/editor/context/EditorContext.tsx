import React, { createContext, RefObject, useContext, useRef } from 'react'
import { WorkspaceSvg } from 'blockly'
import { FuncEnv, VarEnv } from '../engine/ast'
import { Object3D, Scene } from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface EditorContextType {
  funcEnvRef: RefObject<FuncEnv>
  varEnvRef: RefObject<VarEnv>
  sceneRef: RefObject<Scene>
  objectsRef: RefObject<Map<string, Object3D>>
  canvasRef: RefObject<HTMLCanvasElement>
  controlsRef: RefObject<TransformControls | null>
  orbitMapRef: RefObject<Map<number, OrbitControls | null>>
  workspaceRef: RefObject<WorkspaceSvg | null>
  stepsPerFrameRef: RefObject<number>
}

const EditorContext = createContext<EditorContextType>(null!)

export function useEditorRefs() {
  return useContext(EditorContext)
}

export function EditorProvider({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const scene = new Scene()
  scene.sharedId = 'scene'

  const varEnvRef = useRef<VarEnv>(new Map())
  const funcEnvRef = useRef<FuncEnv>(new Map())
  const sceneRef = useRef(scene)
  const objectsRef = useRef(new Map())
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const controlsRef = useRef<TransformControls | null>(null)
  const orbitMapRef = useRef(new Map())
  const workspaceRef = useRef<WorkspaceSvg | null>(null)
  const stepsPerFrameRef = useRef<number>(100)

  return (
    <EditorContext.Provider
      value={{
        funcEnvRef,
        varEnvRef,
        sceneRef,
        objectsRef,
        orbitMapRef,
        canvasRef,
        controlsRef,
        workspaceRef,
        stepsPerFrameRef
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
