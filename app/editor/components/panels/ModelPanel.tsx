import { Canvas } from '@react-three/fiber'
import { useEditor } from '../../lib/EditorContext'
import SceneObject from '../sceneObject'
import { OrbitControls } from '@react-three/drei'

export default function ModelPanel() {
  const { modelScene, objects, currentObject } = useEditor()
  const group = objects.current.get(currentObject)
  const mesh = group?.children[0]

  return (
    <Canvas scene={modelScene.current}>
      <OrbitControls makeDefault />
      {currentObject && mesh && <SceneObject object={mesh.clone()} />}
      <ambientLight intensity={1} />
      <directionalLight position={[3, 5, 2]} intensity={2} />
    </Canvas>
  )
}
