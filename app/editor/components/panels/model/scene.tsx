import { Canvas } from '@react-three/fiber'
import { Grid, OrbitControls, TransformControls } from '@react-three/drei'
import { useEditor } from '@/app/editor/lib/EditorContext'
import SceneObject from '../../sceneObject'
import { useEffect, useRef, useState } from 'react'
import type { Object3D } from 'three'

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

  useEffect(() => {
    mirrorToOriginal.current.clear()
    setSelected(null)

    if (!currentObject) {
      setMirrorChildren([])
      return
    }

    const clones = currentObject.children.map((child) => {
      const clone = child.clone(true)
      mirrorToOriginal.current.set(clone, child)
      return clone
    })

    setMirrorChildren(clones)
  }, [currentObject, objectVersion])

  return (
    <Canvas scene={modelScene.current}>
      <OrbitControls makeDefault />
      <Grid args={[10, 10]} cellSize={1} />

      {mirrorChildren.map((obj) => (
        <SceneObject
          key={obj.uuid}
          object={obj}
          onSelect={setSelected}
          onDeselect={() => setSelected(null)}
        />
      ))}

      {selected && (
        <TransformControls
          key={`${selected}-${objectVersion}`}
          object={selected}
          translationSnap={0.5}
          onChange={() => {
            const original = mirrorToOriginal.current.get(selected)
            if (original) copyTransform(selected, original)
          }}
          onMouseUp={() => {
            setObjectVersion((v) => v + 1)
          }}
        />
      )}

      <ambientLight intensity={1} />
      <directionalLight position={[3, 5, 2]} intensity={2} />
    </Canvas>
  )
}
