import { useEffect } from 'react'
import { useEditor } from '../../lib/EditorContext'
import { exprGenerator } from '../../lib/blockly/engine/generator'
import { evaluateExpression } from '../../lib/blockly/engine/interpreter'
import { serialization } from 'blockly'
import { Expression, ProgramState } from '../../lib/blockly/engine/ast'
import { useTrigger } from '../../lib/TriggerContext'
import { Canvas } from '@react-three/fiber'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import { ProjectData } from '../../lib/types'
import { applyProps } from '../../lib/utils/sobject3d'

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
    runState,
    varEnv,
    funcEnv,
    scene,
    camera,
    canvas,

    workspace,
    isRunning,
    shouldWorkspaceLoad,
    shouldSceneLoad,
    setShouldWorkspaceLoad,
    setShouldSceneLoad,
    setIsRunning
  } = useEditor()
  const { addObject, newSprite, loadDefaultScene } = useObjectActions()

  const emitter = useTrigger()

  /**
   * @todo needs heavy refactoring
   */
  useEffect(() => {
    const data = localStorage.getItem('projectData')
    if (data) {
      try {
        const projectData = JSON.parse(data) as ProjectData
        if (shouldSceneLoad && scene.current.children.length === 0) {
          if (projectData.scene) {
            const { children } = projectData.scene
            applyProps(scene.current, projectData.scene)
            if (children) {
              for (const sobject of children) {
                addObject(sobject)
              }
            }
            console.info('Loaded scene state: ', projectData.scene)
          } else {
            console.info('Starting with an empty scene.')
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
            console.info('Loaded workspace state: ', projectData.workspace)
          } else {
            console.info('Starting with an empty workspace.')
          }
          setShouldWorkspaceLoad(false)
        }
      } catch (err) {
        console.error('Could not parse localStorage data.', err)
      }
    } else {
      if (
        workspace &&
        shouldWorkspaceLoad &&
        workspace.getTopBlocks.length === 0
      ) {
        setShouldWorkspaceLoad(false)
        /**
         * @todo maybe add default blocks
         */
      }
      if (shouldSceneLoad && scene.current.children.length === 0) {
        setShouldSceneLoad(false)
        console.info('Starting with the default scene.')
        loadDefaultScene()
      }
    }
  }, [
    scene,
    loadDefaultScene,
    workspace,
    newSprite,
    addObject,
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
    scene,
    workspace,
    emitter,
    varEnv,
    funcEnv,
    runState,
    isRunning,
    setIsRunning
  ])

  return <Canvas ref={canvas} camera={camera} scene={scene.current} />
}
