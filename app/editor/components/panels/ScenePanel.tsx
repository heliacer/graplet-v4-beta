import { useEffect } from 'react'
import { useEditor } from '../../lib/EditorContext'
import { Canvas } from '@react-three/fiber'
import { useObjectActions } from '../../lib/hooks/useObjectActions'

export default function ScenePanel() {
  const { scene, camera, canvas, workspace, shouldLoad, setShouldLoad } =
    useEditor()
  const { loadDefaultScene, loadProjectData } = useObjectActions()

  useEffect(() => {
    if (
      workspace &&
      shouldLoad &&
      scene.current.children.length === 0 &&
      workspace.getTopBlocks().length === 0
    ) {
      const data = localStorage.getItem('projectData')
      if (data) {
        loadProjectData(data)
      } else {
        /**
         * @todo maybe add default blocks
         * @todo add tutorial floating panel
         */
        loadDefaultScene()
        setShouldLoad(false)
      }
    }
  }, [loadDefaultScene, workspace])

  return <Canvas ref={canvas} camera={camera} scene={scene.current} />
}
