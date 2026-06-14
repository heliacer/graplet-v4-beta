import { Events, serialization } from 'blockly'
import { useEditorRefs } from '../context/editor'
import { ProjectData } from '../types'
import { applyProps } from '../utils/sobject'
import { useObjectActions } from './useObjectActions'
import { blocklyUI } from '../blockly/blocks'
import { GridHelper } from 'three'
import { useEditorStore } from '../state'

export function useSceneActions() {
  const { sceneRef, workspaceRef, orbitMapRef, controlsRef } = useEditorRefs()
  const { addObject, removeObject, rebuildBlocklyUI } = useObjectActions()
  const setSelectedItems = useEditorStore(s => s.setSelectedItems)
  const setTreeVersion = useEditorStore(s => s.setTreeVersion)

  /**
   * Adds Ambient light, Directional light and a Camera
   */
  function loadDefaultScene() {
    clearScene()
    addObject({
      type: 'Mesh',
      name: 'Box',
      geometry: {
        type: 'BoxGeometry',
        args: [1, 1, 1]
      },
      material: {
        type: 'MeshStandardMaterial'
      }
    })
    addObject({
      type: 'PerspectiveCamera',
      name: 'Main Camera',
      position: [0, 8, 14],
      rotation: [0, 0, 0],
      far: 5000
    })
    addObject({
      name: 'Ambient Light',
      type: 'AmbientLight',
      intensity: 1
    })
    addObject({
      name: 'Directional Light',
      type: 'DirectionalLight',
      position: [0, 5, 0],
      intensity: 2
    })
  }

  function loadProjectData(data: string) {
    try {
      const project = JSON.parse(data) as ProjectData
      clearScene()

      if (project.scene) {
        const { children } = project.scene
        applyProps(sceneRef.current, project.scene)
        children?.forEach(child => addObject(child, undefined, true))
        rebuildBlocklyUI()
        setTreeVersion(v => v + 1)
        console.info('%cLoaded scene state: ', 'color: salmon;', project.scene)
        const { selectedItems } = project
        if (selectedItems !== undefined) setSelectedItems(selectedItems)
        requestAnimationFrame(() => {
          if (!workspaceRef.current) throw Error('Missing workspace')
          Events.disable()
          serialization.workspaces.load(project.workspace, workspaceRef.current)
          Events.enable()
          console.info(
            '%cLoaded workspace state:',
            'color: salmon;',
            project.workspace
          )
        })
      }
    } catch (error) {
      console.error('Could not parse JSON data.', error)
    }
  }

  function clearScene() {
    for (let i = sceneRef.current.children.length - 1; i >= 0; i--) {
      const child = sceneRef.current.children[i]
      removeObject(child)
    }
    setSelectedItems([])
    blocklyUI.objectMenu = []
    orbitMapRef.current.clear()
    controlsRef.current?.dispose()
    controlsRef.current = null

    /** @test initialize scene (I have my doubts if this is a good init place) */
    const gridHelper = new GridHelper()
    sceneRef.current.add(gridHelper)
  }

  return {
    loadDefaultScene,
    loadProjectData,
    clearScene
  }
}
