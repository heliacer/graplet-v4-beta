import { serialization } from 'blockly'
import { useOldEditor } from '../EditorContext'
import { ProjectData } from '../types'
import { applyProps } from '../utils/sobject'
import { useObjectActions } from './useObjectActions'
import { blocklyUI } from '../blockly/blocks'
import { GridHelper } from 'three'
import { useEditor } from '../state'

export function useSceneActions() {
  const { scene, workspace, orbitMap, controls } = useOldEditor()
  const { addObject, removeObject } = useObjectActions()
  const setSelectedItems = useEditor(s => s.setSelectedItems)
  
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
        applyProps(scene.current, project.scene)
        children?.forEach(child => addObject(child))
        console.info('%cLoaded scene state: ', 'color: salmon;', project.scene)

        if (!workspace.current) throw Error('Missing workspace')
        serialization.workspaces.load(project.workspace, workspace.current)
        console.info(
          '%cLoaded workspace state:',
          'color: salmon;',
          project.workspace
        )
      }
    } catch (error) {
      console.error('Could not parse JSON data.', error)
    }
  }

  function clearScene() {
    for (let i = scene.current.children.length - 1; i >= 0; i--) {
      const child = scene.current.children[i]
      removeObject(child)
    }
    setSelectedItems([])
    blocklyUI.objectMenu = []
    orbitMap.current.clear()
    controls.current?.dispose()
    controls.current = null

    /** @test initialize scene (I have my doubts if this is a good init place) */
    const gridHelper = new GridHelper()
    scene.current.add(gridHelper)
  }

  return {
    loadDefaultScene,
    loadProjectData,
    clearScene
  }
}
