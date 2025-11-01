import { useEffect } from 'react'
import { useEditor } from '../../lib/EditorContext'
import { Canvas } from '@react-three/fiber'
import { useObjectActions } from '../../lib/hooks/useObjectActions'

export default function ScenePanel() {
  const { scene, camera, canvas, workspace, shouldLoad, setShouldLoad } =
    useEditor()
  const { loadProjectData, loadDefaultScene } = useObjectActions()

  /** Project Loader */
  useEffect(() => {
    if (workspace && shouldLoad) {
      setShouldLoad(false)
      const data = localStorage.getItem('projectData')
      if (data) {
        loadProjectData(data)
      } else {
        /**
         * @todo maybe add default blocks
         * @todo add tutorial floating panel
         */
        loadDefaultScene()
      }
    }
  }, [
    loadDefaultScene,
    workspace,
    loadProjectData,
    scene,
    setShouldLoad,
    shouldLoad
  ])

  return <Canvas ref={canvas} camera={camera} scene={scene.current} />
}
