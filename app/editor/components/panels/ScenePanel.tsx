import { useEffect } from 'react'
import { useEditor } from '../../lib/EditorContext'
import { serialization } from 'blockly'
import { Canvas } from '@react-three/fiber'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import { ProjectData } from '../../lib/types'
import { applyProps } from '../../lib/utils/sobject3d'

export default function ScenePanel() {
  const {
    scene,
    camera,
    canvas,

    workspace,
    shouldWorkspaceLoad,
    shouldSceneLoad,
    setShouldWorkspaceLoad,
    setShouldSceneLoad
  } = useEditor()
  const { addObject, newSprite, loadDefaultScene } = useObjectActions()

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
         * @todo add tutorial floating panel
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

  return <Canvas ref={canvas} camera={camera} scene={scene.current} />
}
