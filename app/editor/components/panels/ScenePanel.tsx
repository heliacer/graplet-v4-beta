import { useEffect, useRef, useState } from "react"
import { Mesh } from "three"
import { useEditor } from "../../lib/EditorContext"
import { irGenerator } from "../../lib/blockly/irGenerator"
import { executeActions, interpret } from "../../lib/blockly/interpreter"
import { Block, Events } from "blockly"
import { Action, VariableManager } from "../../lib/types"
import { useTrigger } from "../../lib/TriggerContext"

export default function ScenePanel() {
  const testingBoxRef = useRef<Mesh>(null!)
  const { workspace } = useEditor()
  const [variableManager] = useState(() => new VariableManager())
  // const { scene } = useThree()
  const emitter = useTrigger()

  function runAction(action: Action) {
    console.log('Running single Action...')
    executeActions(
      [action],
      { box: testingBoxRef, variables: variableManager }
    ).then(() => {
      console.log('Execution completed')
    }).catch((error) => {
      console.error('Execution error', error)
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
    const handler = () => {
      if (!workspace) return
      const IR = irGenerator.workspaceToIR(workspace)
      console.log('Running...')
      interpret(
        IR, { box: testingBoxRef, variables: variableManager }
      ).then(() => {
        // TODO: Update run button
        console.log('Execution completed')
      }).catch((error) => {
        console.error('Execution error:', error)
      })
    }
    emitter.on('runScene', handler)
    return () => {
      emitter.off('runScene', handler)
    }
  }, [emitter, workspace, variableManager])

  useEffect(() => {
    workspace?.addChangeListener(handleWorkspaceClick)
    workspace?.getFlyout()?.getWorkspace().addChangeListener(handleFlyoutWorkspaceClick)
  })

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[3, 5, 2]} intensity={2} />
      <mesh ref={testingBoxRef} rotation={[10, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color='#00bc7d' />
      </mesh>
    </>
  )
}