import { useEffect } from 'react'
import { useEditor } from '../EditorContext'
import { useSceneActions } from './useSceneActions'

/** @todo Add session project loading, this is only local for now */
export function useProjectLoader() {
  const { loadProjectData, loadDefaultScene } = useSceneActions()
  const { scene, workspace, shouldLoad, setShouldLoad } = useEditor()

  useEffect(() => {
    if (workspace && shouldLoad) {
      setShouldLoad(false)
      const data = localStorage.getItem('projectData')
      if (data) {
        loadProjectData(data)
      } else {
        /**
         * @todo Maybe add default blocks
         * @todo Add tutorial floating panel
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
}
