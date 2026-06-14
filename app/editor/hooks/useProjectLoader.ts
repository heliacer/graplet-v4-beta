import { useEffect, useRef } from 'react'
import { useSceneActions } from './useSceneActions'

export function useProjectLoader() {
  const { loadProjectData, loadDefaultScene } = useSceneActions()
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (hasLoaded.current) return
    hasLoaded.current = true
    const data = localStorage.getItem('projectData')
    if (data) loadProjectData(data)
    else loadDefaultScene()
  }, [loadDefaultScene, loadProjectData])
}
