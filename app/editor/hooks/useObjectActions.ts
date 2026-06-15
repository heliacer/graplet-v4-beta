import { useEditorRefs } from '../context/editor'
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
import { applyProps, createObject, serializeObject, serializeObjectConfig } from '../utils/sobject'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { findTopLevelObject, getObject, moveObject } from '../utils/three'
import { useEditorStore } from '../state'

let nextSharedId = 0

export function useObjectActions() {
  const { sceneRef, objectsRef, workspaceRef, orbitMapRef, canvasRef } =
    useEditorRefs()
  const selectedItems = useEditorStore(s => s.selectedItems)
  const setSelectedItems = useEditorStore(s => s.setSelectedItems)
  const camera = useEditorStore(s => s.camera)
  const setCamera = useEditorStore(s => s.setCamera)
  const invalidateObject = useEditorStore(s => s.invalidateObject)
  const setSnapshots = useEditorStore(s => s.setSnapshots)
  const objectSnapshots = useEditorStore(s => s.objectSnapshots)
  const setTreeVersion = useEditorStore(s => s.setTreeVersion)

  /**
   * @private
   */
  function applyHelpers(object: Object3D) {
    if (object instanceof Camera) {
      const helper = new CameraHelper(object)
      helper.name = 'CameraHelper'
      if (
        object instanceof PerspectiveCamera &&
        orbitMapRef.current.size === 0
      ) {
        setCamera(object)
        const controls = new OrbitControls(object, canvasRef.current)
        controls.mouseButtons = {
          MIDDLE: MOUSE.PAN,
          RIGHT: MOUSE.ROTATE
        }
        orbitMapRef.current.set(object.id, controls)
        helper.visible = false
      }
      sceneRef.current.add(helper)
    }
    if (object instanceof DirectionalLight) {
      const helper = new DirectionalLightHelper(object)
      helper.name = 'DirectionalLightHelper'
      sceneRef.current.add(helper)
    }
  }

  function rebuildBlocklyUI() {
    const entries = Object.entries(objectSnapshots)
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

    const object = type === 'Scene' ? sceneRef.current : createObject(snapshot)
    object.sharedId = sharedId
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

    const sharedId = (nextSharedId++).toString()
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
    target: Object3D = sceneRef.current
  ): Object3D {
    const newSnapshots: Record<string, SObjectSnapshot> = {}
    const object = buildObjectTree(config, target, newSnapshots)

    setSnapshots(prev => {
      const targetId = target.sharedId
      if (targetId === undefined)
        throw new ObjectError(target, 'does not have a sharedId')

      return {
        ...prev,
        ...newSnapshots,
        [targetId]: {
          ...prev[targetId],
          childIds: [...prev[targetId].childIds, object.sharedId!]
        }
      }
    })

    return object
  }

  /**
   * Removes an object from its parent and disposes of everything associated with it
   *
   * @todo (#67) ObjectActions: dispose of geometry, material and remove helpers
   */
  function removeObject(object: Object3D) {
    const parent = object.parent
    if (!parent) throw new ParentError(object)

    const sharedId = object.sharedId
    if (sharedId !== undefined) {
      /** Remove it from the registry */
      objectsRef.current.delete(sharedId)

      /** If it's the selection, remove it */
      if (selectedItems.includes(sharedId)) {
        setSelectedItems(prev => prev.filter(item => item !== object.sharedId))
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
        return {
          ...rest,
          [parentId]: {
            ...sobject,
            childIds: sobject.childIds?.filter(id => id !== sharedId)
          }
        }
      })
    }

    parent.remove(object)

    if (object instanceof Camera) {
      /** If it's the active camera, set another one active instead */
      if (object === camera) {
        const nextCamera = sceneRef.current.getObjectByProperty(
          'isCamera',
          true
        ) as Camera
        setCamera(nextCamera || null)
      }
      /** If the camera has orbit controls, dispose of them */
      const orbit = orbitMapRef.current.get(object.id)
      if (orbit) {
        orbit.disconnect()
        orbit.dispose()
        orbitMapRef.current.delete(object.id)
      }
    }

    /** @deprecated */
    invalidateObject(object)

    setTreeVersion(v => v + 1)
    rebuildBlocklyUI()
  }

  function cloneObject(object: Object3D) {
    const parent = object.parent
    if (!parent) throw new ParentError(object)

    const sobject = serializeObjectConfig(object)
    const clone = addObject(sobject, parent)
    clone.position.x += 2
  }

  function groupObjects(objects: Object3D[]) {
    if (objects.length === 0) return
    const firstParent = objects[0].parent
    if (!firstParent) throw new ParentError(objects[0])
    const parent =
      objects.length === 1
        ? firstParent
        : findTopLevelObject(objects, sceneRef.current)
    const target = addObject({ type: 'Group', name: 'Group' }, parent)
    for (const object of objects) {
      moveObject(object, target)
    }
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
    newChildren: string[]
  ) {
    setSnapshots(prev => ({
      ...prev,
      [targetId]: { ...prev[targetId], childIds: newChildren }
    }))

    for (const itemId of itemIds) {
      const object = getObject(objectsRef, itemId)
      const targetObj =
        targetId === 'scene'
          ? sceneRef.current
          : getObject(objectsRef, targetId)

      const parent = object.parent
      if (!parent) throw new ParentError(object)
      parent.remove(object)
      targetObj.add(object)

      invalidateObject(object)
    }
  }

  function unGroupObject(object: Object3D) {
    const parent = object.parent
    if (!parent) throw new ParentError(object)
    const children = object.children
    for (const child of children) {
      parent.add(child)
    }
    parent.remove(object)
    removeObject(object)

    /** @todo (#47) multiselect all children which were previously in the group */
    setSelectedItems([])
  }

  function copyObjects(objects: Object3D[]) {
    const sobjects = objects.map(object => serializeObjectConfig(object))
    const data = JSON.stringify(sobjects)
    navigator.clipboard.writeText(data)
  }

  async function pasteObjects(target: Object3D = sceneRef.current) {
    const text = await navigator.clipboard.readText()
    try {
      const objects: SObject3D[] = JSON.parse(text)
      for (let i = 0; i < objects.length; i++) {
        const object = addObject(objects[i], target)
        if (i + 1 === objects.length) {
          invalidateObject(object)
        }
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
    loadSnapshot: loadSnapshots,
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
