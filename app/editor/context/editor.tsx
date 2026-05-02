import React, { createContext, RefObject, useContext, useRef } from 'react'
import { WorkspaceSvg } from 'blockly'
import { FuncEnv, VarEnv } from '../engine/ast'
import { Object3D, Scene } from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface EditorContextType {
  funcEnv: RefObject<FuncEnv>
  varEnv: RefObject<VarEnv>
  scene: RefObject<Scene>
  objects: RefObject<Map<string, Object3D>>
  modelScene: RefObject<Scene>
  canvas: RefObject<HTMLCanvasElement>
  controls: RefObject<TransformControls | null>
  orbitMap: RefObject<Map<number, OrbitControls | null>>
  workspace: RefObject<WorkspaceSvg | null>
}

const EditorContext = createContext<EditorContextType>(null!)

export function useEditorRefs() {
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
        workspace
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
