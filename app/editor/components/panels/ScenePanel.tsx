import { Canvas } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Mesh } from "three"
import { useEditor } from "../../lib/EditorContext"
import { irGenerator } from "../../lib/blockly/irGenerator"
import { executeActions, interpret } from "../../lib/blockly/interpreter"
import { Block, Events } from "blockly"
import { Action } from "../../lib/types"

export default function ScenePanel() {
  const testingBoxRef = useRef<Mesh>(null!)
  const { runState, workspace, setRunState } = useEditor()

  function runAction(action: Action) {
    setRunState(2)
    console.log('Running single Action...')
    executeActions([action], testingBoxRef).then(() => {
      console.log('Execution completed')
      setRunState(0)
    }).catch((error) => {
      console.error('Execution error', error)
      setRunState(0)
    })
  }

  function handleWorkspaceClick(event: Events.Abstract) {
    if (event.type === Events.CLICK) {
      const clickEvent = event as Events.Click
      if (clickEvent.blockId) {
        const block = workspace?.getBlockById(clickEvent.blockId)
        const action = irGenerator.blockToAction(block as Block)
        if (action) { runAction(action) }
      }
    }
  }

  function handleFlyoutWorkspaceClick(event: Events.Abstract) {
    if (event.type === Events.CLICK) {
      const clickEvent = event as Events.Click
      if (clickEvent.blockId) {
        const block = workspace?.getFlyout()?.getWorkspace().getBlockById(clickEvent.blockId)
        const action = irGenerator.blockToAction(block as Block)
        if (action) { runAction(action) }
      }
    }
  }

  useEffect(() => {
    if (runState === 1 && workspace) {
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

  useEffect(() => {
    workspace?.addChangeListener(handleWorkspaceClick)
    workspace?.getFlyout()?.getWorkspace().addChangeListener(handleFlyoutWorkspaceClick)
  })

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