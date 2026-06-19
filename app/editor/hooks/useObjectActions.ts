import { useEditorRefs } from '../context/EditorContext'
import {
  Camera,
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  MOUSE,
  Object3D,
  PerspectiveCamera
} from 'three'
import { blocklyUI } from '../blockly/blocks'
import {
  ObjectError,
  ParentError,
  SObject3D,
  SObjectConfig,
  SObjectSnapshot
} from '../types'
import {
  applyProps,
  createObject,
  serializeObject,
  serializeObjectConfig
} from '../utils/sobject'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { getObject } from '../utils/three'
import { useEditorStore } from '../state'

let nextSharedId = 0

export function useObjectActions() {
  const { objectsRef, cameraRef, workspaceRef, orbitMapRef, canvasRef } =
    useEditorRefs()
  const selectedItems = useEditorStore(s => s.selectedItems)
  const setSelectedItems = useEditorStore(s => s.setSelectedItems)
  const setSnapshots = useEditorStore(s => s.setSnapshots)
  const objectSnapshots = useEditorStore(s => s.objectSnapshots)
  const setTreeVersion = useEditorStore(s => s.setTreeVersion)

  /**
   * @private
   */
  function applyHelpers(object: Object3D) {
    const scene = getObject(objectsRef, 'scene')
    if (object instanceof Camera) {
      const helper = new CameraHelper(object)
      helper.name = 'CameraHelper'
      if (
        object instanceof PerspectiveCamera &&
        orbitMapRef.current.size === 0
      ) {
        cameraRef.current = object
        const controls = new OrbitControls(object, canvasRef.current)
        controls.mouseButtons = {
          MIDDLE: MOUSE.PAN,
          RIGHT: MOUSE.ROTATE
        }
        orbitMapRef.current.set(object.id, controls)
        helper.visible = false
      }
      scene.add(helper)
    }
    if (object instanceof DirectionalLight) {
      const helper = new DirectionalLightHelper(object)
      helper.name = 'DirectionalLightHelper'
      scene.add(helper)
    }
  }

  function rebuildBlocklyUI(snapshots: Record<string, SObjectSnapshot>) {
    const entries = Object.entries(snapshots)
    blocklyUI.objectMenu = entries.map(([key, obj]) => [obj.name, key])
    workspaceRef.current?.updateToolbox(
      workspaceRef.current.options.languageTree
    )
  }

  /**
   * This is used in the project loading,
   * loading snapshots saved to state
   * into the scene
   */
  function loadSnapshots(
    snapshots: Record<string, SObjectSnapshot>,
    sharedId: string
  ): Object3D {
    const snapshot = snapshots[sharedId]
    const { type, childIds } = snapshot

    const object =
      type === 'Scene' ? getObject(objectsRef, 'scene') : createObject(snapshot)
    object.sharedId = sharedId

    if (Number(sharedId) + 1 > nextSharedId) {
      nextSharedId = Number(sharedId) + 1
    }

    objectsRef.current.set(sharedId, object)

    applyProps(object, snapshot)
    applyHelpers(object)

    for (const childId of childIds) {
      const child = loadSnapshots(snapshots, childId)
      object.add(child)
    }

    return object
  }

  /**
   * @private
   *
   * Build the object tree for new objects
   * and fully serialize them to snapshot state
   */
  function buildObjectTree(
    config: SObjectConfig,
    target: Object3D,
    snapshots: Record<string, SObjectSnapshot>
  ): Object3D {
    const { children } = config

    const object = createObject(config)
    applyProps(object, config)
    applyHelpers(object)
    target.add(object)

    if (children) {
      for (const child of children) {
        buildObjectTree(child, object, snapshots)
      }
    }

    const sharedId =
      config.type === 'Scene' ? 'scene' : (nextSharedId++).toString()
    object.sharedId = sharedId

    const childIds = object.children.map(child => {
      if (child.sharedId === undefined)
        throw new ObjectError(child, 'does not have a sharedId')
      return child.sharedId
    })

    snapshots[sharedId] = { sharedId, ...serializeObject(object), childIds }
    objectsRef.current.set(sharedId, object)

    return object
  }

  /**
   * Add new objects via object config which dont't
   * require sharedId relativeness as snapshots do
   */
  function addObject(
    config: SObjectConfig,
    targetId: string = 'scene'
  ): Object3D {
    const addedSnapshots: Record<string, SObjectSnapshot> = {}

    const target = getObject(objectsRef, targetId)
    const object = buildObjectTree(config, target, addedSnapshots)

    setSnapshots(prev => {
      const sobject = prev[targetId]
      const childIds = sobject ? sobject.childIds : []
      const sharedId = object.sharedId
      if (sharedId === undefined) {
        throw new ObjectError(object, 'does not have a sharedId')
      }
      childIds.push(sharedId)
      const newSnapshots = {
        ...prev,
        ...addedSnapshots,
        [targetId]: {
          ...sobject,
          childIds
        }
      }
      rebuildBlocklyUI(newSnapshots)
      return newSnapshots
    })

    setTreeVersion(v => v + 1)
    return object
  }

  /**
   * Removes an object from its parent and disposes of everything associated with it
   *
   * @todo (#67) ObjectActions: dispose of geometry, material and remove helpers
   *
   *
   * @todo todo: batch remove, make removeObjects
   * less update heavy
   */
  function removeObject(sharedId: string) {
    const object = getObject(objectsRef, sharedId)
    if (sharedId === 'scene') return
    const parent = object.parent
    if (!parent) throw new ParentError(object)

    /** Remove it from the registry */
    objectsRef.current.delete(sharedId)

    /** If it's the selection, remove it */
    if (selectedItems.includes(sharedId)) {
      setSelectedItems(prev => prev.filter(item => item !== sharedId))
    }

    const parentId = parent.sharedId
    if (parentId === undefined) {
      throw new ObjectError(parent, 'does not have a sharedId')
    }

    /** Remove it from the snapshots and update parent childIds */
    setSnapshots(prev => {
      const rest = { ...prev }
      const sobject = rest[parentId]
      delete rest[sharedId]
      const newSnapshots = {
        ...rest,
        [parentId]: {
          ...sobject,
          childIds: sobject.childIds?.filter(id => id !== sharedId)
        }
      }
      rebuildBlocklyUI(newSnapshots)
      return newSnapshots
    })

    parent.remove(object)

    if (object instanceof PerspectiveCamera) {
      /** If it's the active camera, set another one active instead */
      const scene = getObject(objectsRef, 'scene')
      if (object === cameraRef.current) {
        const nextCamera = scene.getObjectByProperty('isPerspectiveCamera', true) as
          | PerspectiveCamera
          | undefined
        cameraRef.current = nextCamera || null
      }
      /** If the camera has orbit controls, dispose of them */
      const orbit = orbitMapRef.current.get(object.id)
      if (orbit) {
        orbit.disconnect()
        orbit.dispose()
        orbitMapRef.current.delete(object.id)
      }
    }

    setTreeVersion(v => v + 1)
  }

  function cloneObject(sharedId: string) {
    const object = getObject(objectsRef, sharedId)
    const parent = object.parent
    if (!parent) throw new ParentError(object)
    const parentId = parent.sharedId
    if (parentId === undefined) {
      throw new ObjectError(parent, 'does not have a sharedId')
    }

    const sobject = serializeObjectConfig(object)
    const clone = addObject(sobject, parentId)
    clone.position.x += 2
  }

  function groupObjects(sharedIds: string[]) {
    /** @todo */

    if (sharedIds.length < 1) return
    // findTopLevelObject(sharedIds, snapshots) @todo
    const target = addObject({ type: 'Group', name: 'Group' })
    if (target.sharedId === undefined) {
      throw new ObjectError(target, 'does not have a sharedId')
    }
    moveObjects(sharedIds, target.sharedId)
  }

  /**
   * Removes an object from the previous parent and adds it to the new target
   * and updates the snapshots with relative sharedIds (newChildren)
   *
   * @todo (#84)
   */
  function moveObjects(
    itemIds: string[],
    targetId: string,
    newChildren?: string[]
  ) {
    /**
     * @todo this is shit,
     * should get the highest parent in the itemIds selection.
     * only move itemIds that are in the childIds of that parent
     */

    const itemParentMap: Record<string, string> = {}
    for (const itemId of itemIds) {
      const object = getObject(objectsRef, itemId)
      const targetObj = getObject(objectsRef, targetId)

      const parent = object.parent
      if (!parent) throw new ParentError(object)
      const parentId = parent.sharedId
      if (parentId === undefined) {
        throw new ObjectError(parent, 'does not have a sharedId')
      }
      itemParentMap[itemId] = parentId
      parent.remove(object)
      targetObj.add(object)
    }

    setSnapshots(prev => {
      const updated = { ...prev }

      for (const [itemId, parentId] of Object.entries(itemParentMap)) {
        if (parentId === targetId) continue
        updated[parentId] = {
          ...updated[parentId],
          childIds: updated[parentId].childIds.filter(id => id !== itemId)
        }
      }

      updated[targetId] = {
        ...updated[targetId],
        childIds:
          newChildren === undefined
            ? [
                ...prev[targetId].childIds.filter(id => !itemIds.includes(id)),
                ...itemIds
              ]
            : newChildren
      }

      return updated
    })
  }

  function unGroupObject(sharedId: string) {
    const object = getObject(objectsRef, sharedId)
    const parent = object.parent
    if (!parent) throw new ParentError(object)

    const parentId = parent.sharedId
    if (parentId === undefined) {
      throw new ObjectError(parent, 'does not have a sharedId')
    }

    const sobject = objectSnapshots[sharedId]

    moveObjects(sobject.childIds, parentId)
    removeObject(sharedId)

    /** @todo (#47) multiselect all children which were previously in the group */
    setSelectedItems([])
  }

  function copyObjects(sharedIds: string[]) {
    const objects = sharedIds.map(sharedId => getObject(objectsRef, sharedId))
    const sobjects = objects.map(object => serializeObjectConfig(object))
    const data = JSON.stringify(sobjects)
    navigator.clipboard.writeText(data)
  }

  async function pasteObjects(targetId: string = 'scene') {
    const text = await navigator.clipboard.readText()
    try {
      const objects: SObject3D[] = JSON.parse(text)
      for (let i = 0; i < objects.length; i++) {
        addObject(objects[i], targetId)
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.warn(`"${text}" isn't valid object(s) to paste`)
      } else {
        console.error(error)
      }
    }
  }

  return {
    addObject,
    loadSnapshots,
    removeObject,
    cloneObject,
    moveObjects,
    groupObjects,
    unGroupObject,
    copyObjects,
    pasteObjects,
    rebuildBlocklyUI
  }
}
