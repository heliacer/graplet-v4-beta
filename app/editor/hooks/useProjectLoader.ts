import { useEffect, useRef } from 'react'
import { useSceneActions } from './useSceneActions'
import { useEditorStore } from '../state'

export function useProjectLoader() {
  const { loadProjectData, loadDefaultScene } = useSceneActions()
  const setTreeVersion = useEditorStore(s => s.setTreeVersion)
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (hasLoaded.current) return
    hasLoaded.current = true
    const data = localStorage.getItem('projectData')
    if (data) loadProjectData(data)
    else loadDefaultScene()
    setTreeVersion(v => v + 1)
  }, [loadDefaultScene, loadProjectData, setTreeVersion])
}
