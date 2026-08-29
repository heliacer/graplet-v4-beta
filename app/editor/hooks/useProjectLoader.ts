import { useEffect, useRef } from 'react'
import { useSceneActions } from './useSceneActions'

export function useProjectLoader() {
  const { loadProjectData, loadDefaultScene, setupScene } = useSceneActions()
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (hasLoaded.current) return
    hasLoaded.current = true
    setupScene()
    
    /** @todo (#79) Fix project loading: add zod schema */
    const data = localStorage.getItem('projectData')
    if (data) loadProjectData(data)
    else loadDefaultScene()
  }, [loadDefaultScene, loadProjectData, setupScene])
}
