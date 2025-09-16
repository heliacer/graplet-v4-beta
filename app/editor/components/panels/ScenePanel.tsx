import { useCallback, useEffect, useState } from 'react'
import { BoxGeometry, Mesh, MeshStandardMaterial, Object3D } from 'three'
import { useEditor } from '../../lib/EditorContext'
import { exprGenerator } from '../../lib/blockly/exprGenerator'
import { evaluateExpression } from '../../lib/blockly/interpreter'
import { Block, Events, serialization } from 'blockly'
import {
  VariableEnv,
  FunctionsEnv,
  Expression,
  ProgramState
} from '../../lib/types'
import { useTrigger } from '../../lib/TriggerContext'
import { ThreeEvent, useThree } from '@react-three/fiber'
import {
  Grid,
  OrbitControls,
  TransformControls,
  useCursor
} from '@react-three/drei'

/**
 * @todo This method is temporary
 */
function tempExec(expr: Expression, state: ProgramState) {
  console.log('Running...')
  console.time('Done in')
  evaluateExpression(expr, state)
    .then(() => {
      console.timeEnd('Done in')
    })
    .catch((err) => {
      console.timeEnd('Done in')
      console.error(err)
    })
}

function Object({
  object,
  onSelect,
  onDeselect
}: {
  object: Object3D
  onSelect: (id: string) => void
  onDeselect: () => void
}) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  return (
    <primitive
      object={object}
      onClick={(e: ThreeEvent<MouseEvent>) => (
        e.stopPropagation(),
        onSelect(object.name)
      )}
      onPointerMissed={(e: MouseEvent) => e.type === 'click' && onDeselect()}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => (
        e.stopPropagation(),
        setHovered(true)
      )}
      onPointerOut={() => setHovered(false)}
    />
  )
}

export default function ScenePanel() {
  const [variableEnv] = useState<VariableEnv>(new Map())
  const [functionsEnv] = useState<FunctionsEnv>(new Map())
  const [objectCounter, setObjectCounter] = useState(0)
  const { scene } = useThree()
  const {
    workspace,
    objects,
    currentObject,
    setCurrentObject,
    runState: runState
  } = useEditor()
  const emitter = useTrigger()

  const handleCreateObject = useCallback(() => {
    const cube = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: '#ff6080' })
    )

    cube.name = `Cube ${objectCounter + 1}`

    scene.add(cube)
    objects.current.set(cube.name, cube)
    setCurrentObject(cube.name)
    emitter.emit('objectCreated', { object: cube })
    setObjectCounter(objectCounter + 1)
  }, [objectCounter, scene, objects, emitter, setCurrentObject])

  useEffect(() => {
    if (objects.current.size === 0 && workspace) {
      handleCreateObject()

      // TODO: load objects state

      // load workspace state
      const data = localStorage.getItem('projectData')
      if (data) {
        try {
          const workspaceState = JSON.parse(data)
          serialization.workspaces.load(workspaceState, workspace)
          console.log(
            'Loaded workspace state from localStorage: ',
            workspaceState
          )
        } catch (err) {
          console.error('Could not parse localStorage data.', err)
        }
      }
    }
  }, [handleCreateObject, objects, workspace])

  useEffect(() => {
    // this is extreme doodoo cheese code right now, but once the Program instance is introduced, this will be a lot better

    function handleWorkspaceClick(event: Events.Abstract) {
      if (event.type === Events.CLICK) {
        const clickEvent = event as Events.Click
        if (clickEvent.blockId) {
          const block = workspace?.getBlockById(clickEvent.blockId)
          const expr = exprGenerator.blockToExpression(block as Block)
          tempExec(expr, {
            scene,
            objects: objects.current,
            variables: variableEnv,
            functions: functionsEnv,
            runState: runState
          })
        }
      }
    }

    function handleFlyoutWorkspaceClick(event: Events.Abstract) {
      if (event.type === Events.CLICK) {
        const clickEvent = event as Events.Click
        if (clickEvent.blockId) {
          const block = workspace
            ?.getFlyout()
            ?.getWorkspace()
            .getBlockById(clickEvent.blockId)
          const expr = exprGenerator.blockToExpression(block as Block)
          tempExec(expr, {
            scene,
            objects: objects.current,
            variables: variableEnv,
            functions: functionsEnv,
            runState: runState
          })
        }
      }
    }

    workspace?.addChangeListener(handleWorkspaceClick)
    workspace
      ?.getFlyout()
      ?.getWorkspace()
      .addChangeListener(handleFlyoutWorkspaceClick)

    return () => {
      workspace?.removeChangeListener(handleWorkspaceClick)
      workspace
        ?.getFlyout()
        ?.getWorkspace()
        .removeChangeListener(handleFlyoutWorkspaceClick)
    }
  }, [workspace, objects, scene, variableEnv, functionsEnv, runState])

  useEffect(() => {
    const handleRunScene = () => {
      if (!workspace) return
      const expr = exprGenerator.workspaceToExpression(workspace)
      tempExec(expr, {
        scene,
        objects: objects.current,
        variables: variableEnv,
        functions: functionsEnv,
        runState: runState
      })
    }
    emitter.on('runScene', handleRunScene)
    return () => emitter.off('runScene', handleRunScene)
  }, [objects, scene, emitter, workspace, variableEnv, functionsEnv, runState])

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
      {currentObject && (
        <TransformControls object={objects.current.get(currentObject)} />
      )}
      <ambientLight intensity={1} />
      <directionalLight position={[3, 5, 2]} intensity={2} />
    </>
  )
}
