import { useEffect } from 'react'
import { useObjectActions } from './useObjectActions'
import { useEditor } from '../EditorContext'

/** @todo add session project loading, this is only local for now */
export function useProjectLoader() {
  const { loadProjectData, loadDefaultScene } = useObjectActions()
  const { scene, workspace, shouldLoad, setShouldLoad } = useEditor()

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
}
