import { Canvas } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Mesh } from "three"
import { useEditor } from "../../lib/EditorContext"
import { irGenerator } from "../../lib/blockly/irGenerator"
import { interpret } from "../../lib/blockly/interpreter"

export default function ScenePanel() {
  const testingBoxRef = useRef<Mesh>(null!)
  const { runState, workspace, setRunState } = useEditor()

  useEffect(() => {
    if (runState === 1 && workspace) {
      console.log('Generating IR...')
      const IR = irGenerator.workspaceToIR(workspace)
      console.log('Running...')
      interpret(IR, testingBoxRef).then(() => {
        console.log('Execution completed')
        setRunState(0)
      }).catch((error) => {
        console.error('Execution error:', error)
        setRunState(0)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runState])

  return (
    <Canvas>
      <ambientLight intensity={1} />
      <directionalLight position={[3, 5, 2]} intensity={2} />
      <mesh ref={testingBoxRef} rotation={[10, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color='#00bc7d' />
      </mesh>
    </Canvas>
  )
}
