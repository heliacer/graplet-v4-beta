import { serialization } from 'blockly'
import { useEditorRefs } from '../context'
import { ProjectData } from '../types'
import { applyProps } from '../utils/sobject'
import { useObjectActions } from './useObjectActions'
import { blocklyUI } from '../blockly/blocks'
import { GridHelper } from 'three'
import { useEditorStore } from '../state'

export function useSceneActions() {
  const { scene, workspace, orbitMap, controls } = useEditorRefs()
  const { addObject, removeObject } = useObjectActions()
  const setSelectedItems = useEditorStore(s => s.setSelectedItems)

  /**
   * @todo (#69) Save active item to project data and allow for silent object addition
   *
   * for both loadDefaultScene and loadProjectData:
   * - make addObject be slient about marking the added object as selectedItem
   * - save the active item sharedId, so that we can select it back
   * - in default load just don't set silent to true
   */

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
    addObject(
      {
        type: 'PerspectiveCamera',
        name: 'Main Camera',
        position: [0, 8, 14],
        rotation: [0, 0, 0],
        far: 5000
      },
      undefined,
      true
    )
    addObject(
      {
        name: 'Ambient Light',
        type: 'AmbientLight',
        intensity: 1
      },
      undefined,
      true
    )
    addObject(
      {
        name: 'Directional Light',
        type: 'DirectionalLight',
        position: [0, 5, 0],
        intensity: 2
      },
      undefined,
      true
    )
  }

  function loadProjectData(data: string) {
    try {
      const project = JSON.parse(data) as ProjectData
      clearScene()

      if (project.scene) {
        const { children } = project.scene
        applyProps(scene.current, project.scene)
        children?.forEach(child => addObject(child, undefined, true))
        console.info('%cLoaded scene state: ', 'color: salmon;', project.scene)
        const { selectedItems } = project
        if (selectedItems !== undefined) setSelectedItems(selectedItems)
        requestAnimationFrame(() => {
          if (!workspace.current) throw Error('Missing workspace')
          serialization.workspaces.load(project.workspace, workspace.current)
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
