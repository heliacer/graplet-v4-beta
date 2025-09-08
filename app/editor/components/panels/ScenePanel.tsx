import { useCallback, useEffect, useState } from "react"
import { BoxGeometry, Mesh, MeshStandardMaterial, Object3D } from "three"
import { useEditor } from "../../lib/EditorContext"
import { irGenerator } from "../../lib/blockly/IRGenerator"
import { executeActions, interpret } from "../../lib/blockly/interpreter"
import { Block, Events } from "blockly"
import { Action, VariableManager } from "../../lib/types"
import { useTrigger } from "../../lib/TriggerContext"
import { ThreeEvent, useThree } from "@react-three/fiber"
import { Grid, OrbitControls, TransformControls, useCursor } from "@react-three/drei"

function Object({ object, onSelect, onDeselect }: {
  object: Object3D
  onSelect: (id: string) => void
  onDeselect: () => void
}) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  return (
    <primitive
      object={object}
      onClick={(e: ThreeEvent<MouseEvent>) => (e.stopPropagation(), onSelect(object.uuid))}
      onPointerMissed={(e: MouseEvent) => e.type === 'click' && onDeselect()}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
    />
  )
}

export default function ScenePanel() {
  const [variableManager] = useState(() => new VariableManager())
  const [objectCounter, setObjectCounter] = useState(0)
  const { scene } = useThree()
  const { workspace, objects, currentObject, setCurrentObject } = useEditor()
  const emitter = useTrigger()

  const handleCreateObject = useCallback(() => {
    const cube = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: '#ff6080' })
    )

    cube.name = `Cube ${objectCounter + 1}`

    scene.add(cube)
    objects.current.set(cube.name, cube)
    emitter.emit('objectCreated', { id: cube.uuid, object: cube })
    setObjectCounter(objectCounter + 1)
  }, [objectCounter, scene, objects, emitter])

  useEffect(() => {
    if (objects.current.size === 0) {
      handleCreateObject()
    }
  }, [handleCreateObject, objects])

  useEffect(() => {
    function runAction(action: Action) {
      console.log('Running single Action...')
      executeActions(
        [action],
        {
          scene,
          objects: objects.current,
          variables: variableManager
        }
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

    workspace?.addChangeListener(handleWorkspaceClick)
    workspace?.getFlyout()?.getWorkspace().addChangeListener(handleFlyoutWorkspaceClick)
    
    return () => {
      workspace?.removeChangeListener(handleWorkspaceClick)
      workspace?.getFlyout()?.getWorkspace().removeChangeListener(handleFlyoutWorkspaceClick)
    }
  }, [workspace, objects, scene, variableManager])
  
  useEffect(() => {
    const handleRunScene = () => {
      if (!workspace) return
      const IR = irGenerator.workspaceToIR(workspace)
      // TODO: Update run button, trigger runStart
      console.log('Running...')
      interpret(
        IR,
        {
          scene,
          objects: objects.current,
          variables: variableManager
        }
      ).then(() => {
        // TODO: Update run button, trigger runEnd
        console.log('Execution completed')
      }).catch((error) => {
        console.error('Execution error:', error)
      })
    }
    emitter.on('runScene', handleRunScene)
    return () => emitter.off('runScene', handleRunScene)
  }, [objects, scene, emitter, workspace, variableManager])
  
  useEffect(() => {
    emitter.on('createObject', handleCreateObject)
    return () => emitter.off('createObject', handleCreateObject)
  }, [emitter, handleCreateObject])

  return (
    <>
      <OrbitControls makeDefault />
      <Grid args={[10, 10]} cellSize={1} />
      {Array.from(objects.current).map(([key, object]) => (
        <Object
          key={key}
          object={object}
          onSelect={setCurrentObject}
          onDeselect={() => setCurrentObject('')}
        />
      ))}
      {currentObject && (<TransformControls object={objects.current.get(currentObject)}/>)}
      <ambientLight intensity={1} />
      <directionalLight position={[3, 5, 2]} intensity={2} />
    </>
  )
}