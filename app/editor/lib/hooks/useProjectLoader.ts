import { useEffect, useRef } from 'react'
import { useEditorRefs } from '../context'
import { useSceneActions } from './useSceneActions'

export function useProjectLoader() {
  const { loadProjectData, loadDefaultScene } = useSceneActions()
  const { workspace } = useEditorRefs()
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (!workspace || hasLoaded.current) return
    hasLoaded.current = true

    const data = localStorage.getItem('projectData')
    if (data) {
      loadProjectData(data)
    } else {
      loadDefaultScene()
    }
  }, [workspace, loadDefaultScene, loadProjectData])
}
