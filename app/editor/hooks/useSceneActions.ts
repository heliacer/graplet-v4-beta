import { Events, serialization } from 'blockly'
import { useEditorRefs } from '../context/EditorContext'
import { ProjectData } from '../types'
import { useObjectActions } from './useObjectActions'
import { blocklyUI } from '../blockly/blocks'
import { GridHelper } from 'three'
import { useEditorStore } from '../state'
import { getObject } from '../utils/three'

export function useSceneActions() {
  const { objectsRef, workspaceRef, orbitMapRef, controlsRef } = useEditorRefs()
  const { loadSnapshots, addObject, removeObject, rebuildBlocklyUI } =
    useObjectActions()
  const setSelectedItems = useEditorStore(s => s.setSelectedItems)
  const setTreeVersion = useEditorStore(s => s.setTreeVersion)
  const objectSnapshots = useEditorStore(s => s.objectSnapshots)
  const setSnapshots = useEditorStore(s => s.setSnapshots)

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

      const { snapshots, selectedItems, workspace } = project

      /**
       * @todo for avoiding errors on the client side,
       * check for every prop if it isn't undefined
       * (check if project data is outdated, or corrupted)
       * then offer to refresh all the project data
       */

      loadSnapshots(snapshots, 'scene')
      setSnapshots(snapshots)
      rebuildBlocklyUI(snapshots)
      setTreeVersion(v => v + 1)
      console.info('%cLoaded snapshot state: ', 'color: salmon;', snapshots)
      if (selectedItems !== undefined) setSelectedItems(selectedItems)
      requestAnimationFrame(() => {
        if (!workspaceRef.current) throw Error('Missing workspace')
        Events.disable()
        serialization.workspaces.load(workspace, workspaceRef.current)
        Events.enable()
        console.info('%cLoaded workspace state:', 'color: salmon;', workspace)
      })
    } catch (error) {
      console.error('Could not parse JSON data.', error)
    }
  }

  function clearScene() {
    for (const sharedId of Object.keys(objectSnapshots)) {
      removeObject(sharedId)
    }
    setSelectedItems([])
    blocklyUI.objectMenu = []
    orbitMapRef.current.clear()
    controlsRef.current?.detach()
    controlsRef.current = null

    /** @test initialize scene (I have my doubts if this is a good init place) */
    const gridHelper = new GridHelper()
    const scene = getObject(objectsRef, 'scene')
    scene.add(gridHelper)
  }

  return {
    loadDefaultScene,
    loadProjectData,
    clearScene
  }
}
