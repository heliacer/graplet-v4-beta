import { useCallback, useEffect, useState } from 'react'
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'
import { useEditor } from '../../lib/EditorContext'
import { exprGenerator } from '../../lib/blockly/exprGenerator'
import { evaluateExpression } from '../../lib/blockly/interpreter'
import { serialization } from 'blockly'
import { Expression, ProgramState } from '../../lib/types'
import { useTrigger } from '../../lib/TriggerContext'
import { useThree } from '@react-three/fiber'
import { Grid, OrbitControls, TransformControls } from '@react-three/drei'
import SceneObject from '../sceneObject'

/**
 * This is not supposed to be the end result, I have to come up with something smarter than this
 */
async function execHelper(
  expr: Expression,
  state: ProgramState,
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
) {
  setIsRunning(true)
  console.log('%cRunning...', 'color: lightseagreen;')
  console.time('Done in')
  try {
    const result = await evaluateExpression(expr, state)
    console.log('%coutput:', 'color: cornflowerblue;', result)
  } catch (err) {
    console.error(err)
  } finally {
    console.timeEnd('Done in')
    setIsRunning(false)
    state.runState.current.shouldStop = false
    state.runState.current.shouldPause = false
  }
}

export default function ScenePanel() {
  const [objectCounter, setObjectCounter] = useState(0)
  const { scene } = useThree()
  const {
    workspace,
    objects,
    currentObject,
    setCurrentObject,
    runState,
    isRunning,
    setIsRunning,
    funcEnv,
    varEnv
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

      /**
       * @todo Load objects state
       */

      // Load workspace state
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
    const handleRunScene = async () => {
      if (!workspace) return
      const expr = exprGenerator.workspaceToExpression(workspace)
      await execHelper(
        expr,
        {
          scene,
          objects: objects.current,
          variables: varEnv.current,
          functions: funcEnv.current,
          runState: runState
        },
        setIsRunning
      )
    }

    emitter.on('runScene', handleRunScene)
    return () => emitter.off('runScene', handleRunScene)
  }, [
    objects,
    scene,
    workspace,
    emitter,
    varEnv,
    funcEnv,
    runState,
    isRunning,
    setIsRunning
  ])

  useEffect(() => {
    emitter.on('createObject', handleCreateObject)
    return () => emitter.off('createObject', handleCreateObject)
  }, [emitter, handleCreateObject])

  return (
    <>
      <OrbitControls makeDefault />
      <Grid args={[10, 10]} cellSize={1} />
      {Array.from(objects.current).map(([key, object]) => (
        <SceneObject
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
