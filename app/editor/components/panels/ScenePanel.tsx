import { useEditor } from '../../lib/EditorContext'
import { Canvas } from '@react-three/fiber'

export default function ScenePanel() {
  const { scene, camera, canvas } = useEditor()
  return <Canvas ref={canvas} camera={camera} scene={scene.current} />
}
