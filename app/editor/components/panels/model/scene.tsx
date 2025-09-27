import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useEditor } from '@/app/editor/lib/EditorContext'
import SceneObject from '../../sceneObject'
import { useEffect, useState } from 'react'
import { Object3D } from 'three'

export default function ModelScene() {
  const { modelScene, objects, currentObject, objectVersion } = useEditor()
  const [model, setModel] = useState<Object3D>()

  useEffect(() => {
    setModel(objects.current.get(currentObject)?.clone())
  }, [objectVersion, currentObject])

  return (
    <Canvas scene={modelScene.current}>
      <OrbitControls makeDefault />
      { model && <SceneObject object={model} />}
      <ambientLight intensity={1} />
      <directionalLight position={[3, 5, 2]} intensity={2} />
    </Canvas>
  )
}
