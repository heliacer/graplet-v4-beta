import { Canvas } from '@react-three/fiber'
import { Grid, OrbitControls, TransformControls } from '@react-three/drei'
import { useEditor } from '@/app/editor/lib/EditorContext'
import SceneObject from '../../sceneObject'
import { useEffect, useRef, useState } from 'react'
import type { Object3D } from 'three'
import type { TransformControls as TransformControlsImpl } from 'three-stdlib'

function copyTransform(src: Object3D, dst: Object3D) {
  dst.position.copy(src.position)
  dst.quaternion.copy(src.quaternion)
  dst.scale.copy(src.scale)
  dst.updateMatrixWorld(true)
}

export default function ModelScene() {
  const { modelScene, currentObject, objectVersion, setObjectVersion } =
    useEditor()

  const [mirrorChildren, setMirrorChildren] = useState<Object3D[]>([])
  const [selected, setSelected] = useState<Object3D | null>(null)
  const mirrorToOriginal = useRef(new Map<Object3D, Object3D>())
  const originalToMirror = useRef(new Map<Object3D, Object3D>())
  const selectedOriginalRef = useRef<Object3D | null>(null)
  const selectedRef = useRef<Object3D | null>(null)
  const [mode, setMode] = useState<'translate' | 'rotate' | 'scale'>('translate') /** Gonna be more in future, such as path, origin */

  useEffect(() => {
    selectedRef.current = selected
  }, [selected])

  const tcRef = useRef<TransformControlsImpl | null>(null)

  useEffect(() => {
    const controls = tcRef.current
    if (!controls || !controls.addEventListener) return
    
    /** This is a mess, needs cleanup */
    type DraggingChangedEvent = {
      type: 'dragging-changed'
      value: boolean
    }
    interface TCEventDispatcher {
      addEventListener: (
        type: 'dragging-changed',
        listener: (event: DraggingChangedEvent) => void
      ) => void
      removeEventListener: (
        type: 'dragging-changed',
        listener: (event: DraggingChangedEvent) => void
      ) => void
    }
    const handleDragChanged = (e: DraggingChangedEvent) => {
      if (!e?.value) {
        const sel = selectedRef.current
        if (sel) {
          const orig = mirrorToOriginal.current.get(sel) ?? null
          selectedOriginalRef.current = orig
          setSelected(null)
          setObjectVersion((v) => v + 1)
        }
      }
    }
    const tc = controls as unknown as TCEventDispatcher
    tc.addEventListener('dragging-changed', handleDragChanged)
    return () => {
      tc.removeEventListener?.('dragging-changed', handleDragChanged)
    }
  }, [setObjectVersion])

  useEffect(() => {
    mirrorToOriginal.current.clear()
    originalToMirror.current.clear()
    setSelected(null)

    if (!currentObject) {
      setMirrorChildren([])
      selectedOriginalRef.current = null
      return
    }

    const clones = currentObject.children.map((child) => {
      const clone = child.clone(true)
      mirrorToOriginal.current.set(clone, child)
      originalToMirror.current.set(child, clone)
      return clone
    })

    setMirrorChildren(clones)
  }, [currentObject, objectVersion])

  useEffect(() => {
    if (!selectedOriginalRef.current) return
    const next = originalToMirror.current.get(selectedOriginalRef.current)
    if (next) setSelected(next)
  }, [mirrorChildren])

  return (
    <>
      <Canvas scene={modelScene.current}>
        <OrbitControls enableDamping={false} makeDefault />
        <Grid args={[10, 10]} cellSize={0.5} />

        {mirrorChildren.map((obj) => (
          <SceneObject
            key={obj.uuid}
            object={obj}
            onSelect={(o) => {
              setSelected(o)
              selectedOriginalRef.current = mirrorToOriginal.current.get(o) ?? null
            }}
            onDeselect={() => {
              setSelected(null)
              selectedOriginalRef.current = null
            }}
          />
        ))}

        {selected && (
          <TransformControls
            mode={mode}
            key={`${selected.uuid}-${objectVersion}`}
            ref={tcRef}
            object={selected}
            translationSnap={0.5}
            onChange={() => {
              const original = mirrorToOriginal.current.get(selected)
              if (original) copyTransform(selected, original)
            }}
          />
        )}

        <ambientLight intensity={1} />
        <directionalLight position={[3, 5, 2]} intensity={2} />
      </Canvas>
      <div className='absolute flex flex-col gap-1 bottom-3 left-3'>
        <button onClick={() => setMode('translate')}>
          translate
        </button>
        <button onClick={() => setMode('rotate')}>
          rotate
        </button>
        <button onClick={() => setMode('scale')}>
          scale
        </button>
      </div>
    </>
  )
}
