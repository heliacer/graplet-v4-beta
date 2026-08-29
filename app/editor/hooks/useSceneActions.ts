import { Events, serialization } from 'blockly'
import { useEditorRefs } from '../context/EditorContext'
import { ProjectData } from '../types'
import { useObjectActions } from './useObjectActions'
import { blocklyUI } from '../blockly/blocks'
import { useEditorStore } from '../state'
import { GridHelper, Scene } from 'three'

export function useSceneActions() {
  const { workspaceRef, orbitMapRef, controlsRef, objectsRef } =
    useEditorRefs()
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
      const { snapshots, selectedItems, workspace } = project

      /**
       * @todo (#79) useSceneActions: fix project loading
       * for avoiding errors on the client side,
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

  function resetScene() {
    for (const sharedId of Object.keys(objectSnapshots)) {
      removeObject(sharedId)
    }
    setSelectedItems([])
    blocklyUI.objectMenu = []
    orbitMapRef.current.clear()
    controlsRef.current?.detach()
    controlsRef.current = null
  }

  function setupScene() {
    if (!objectsRef.current.has('scene')) {
      const scene = new Scene()
      scene.sharedId = 'scene'
      const gridHelper = new GridHelper()
      scene.add(gridHelper)
      objectsRef.current.set('scene', scene)
    }
  }

  return {
    loadDefaultScene,
    loadProjectData,
    resetScene,
    setupScene
  }
}
