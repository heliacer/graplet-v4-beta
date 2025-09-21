import { useEffect } from 'react'
import { useEditor } from '../../lib/EditorContext'
import { exprGenerator } from '../../lib/blockly/exprGenerator'
import { evaluateExpression } from '../../lib/blockly/interpreter'
import { serialization } from 'blockly'
import { Expression, ProgramState } from '../../lib/blockly/ast'
import { useTrigger } from '../../lib/TriggerContext'
import { Canvas } from '@react-three/fiber'
import { Grid, OrbitControls, TransformControls } from '@react-three/drei'
import SceneObject from '../sceneObject'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import { ProjectData } from '../../lib/types'

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
  const {
    objects,
    runState,
    varEnv,
    funcEnv,
    scene,

    workspace,
    currentObject,
    isRunning,
    objectNames,
    shouldWorkspaceLoad,
    shouldSceneLoad,
    setShouldWorkspaceLoad,
    setShouldSceneLoad,
    setCurrentObject,
    setObjectVersion,
    setIsRunning
  } = useEditor()
  const { createObject } = useObjectActions()

  const emitter = useTrigger()

  /**
   * @todo needs heavy refactoring
   */
  useEffect(() => {
    const data = localStorage.getItem('projectData')
    if (data) {
      try {
        const projectData = JSON.parse(data) as ProjectData
        if (shouldSceneLoad && objects.current.size === 0) {
          if (projectData.scene) {
            for (const object of projectData.scene.objects) {
              createObject(object)
            }
            console.log('Loaded scene state: ', projectData.scene)
          } else {
            createObject()
            console.log('Starting with an empty scene.')
          }
          setShouldSceneLoad(false)
        }
        if (
          workspace &&
          shouldWorkspaceLoad &&
          workspace.getTopBlocks.length === 0
        ) {
          if (projectData.workspace) {
            serialization.workspaces.load(projectData.workspace, workspace)
            console.log('Loaded workspace state: ', projectData.workspace)
          } else {
            console.log('Starting with an empty workspace.')
          }
          setShouldWorkspaceLoad(false)
        }
      } catch (err) {
        console.error('Could not parse localStorage data.', err)
      }
    }
  }, [
    objects,
    workspace,
    objectNames,
    createObject,
    setShouldWorkspaceLoad,
    shouldWorkspaceLoad,
    shouldSceneLoad,
    setShouldSceneLoad
  ])

  useEffect(() => {
    const handleRunScene = async () => {
      if (!workspace) return
      const expr = exprGenerator.workspaceToExpression(workspace)
      await execHelper(
        expr,
        {
          scene: scene.current,
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

  return (
    <Canvas scene={scene.current}>
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
        <TransformControls
          object={objects.current.get(currentObject)}
          translationSnap={0.5}
          onObjectChange={() => {
            setObjectVersion((prev) => prev + 1)
          }}
        />
      )}
      <ambientLight intensity={1} />
      <directionalLight position={[3, 5, 2]} intensity={2} />
    </Canvas>
  )
}
