import { Canvas } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Mesh } from "three"
import { useEditor } from "../../lib/EditorContext"

export default function ScenePanel() {
  const boxRef = useRef<Mesh>(null!)
  const { ir, runTrigger } = useEditor()

  useEffect(() => {
    if (runTrigger > 0) {
      console.log(ir)
    }
  }, [runTrigger, ir])

  return (
    <Canvas>
      <ambientLight intensity={1} />
      <directionalLight position={[3, 5, 2]} intensity={2} />
      <mesh ref={boxRef} rotation={[10, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color='#00bc7d' />
      </mesh>
    </Canvas>
  )
}
