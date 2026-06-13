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
  Optional,
  ParentError,
  SObject3D,
  TransformProps
} from '../types'
import {
  applyProps,
  createObject,
  serializeObject,
  snapshotObject
} from '../utils/sobject'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { findTopLevelObject, getObject, moveObject } from '../utils/three'
import { useEditorStore } from '../state'

let nextSharedId = 0

export function useObjectActions() {
  const { sceneRef, objectsRef, workspaceRef, orbitMapRef, canvasRef } =
    useEditorRefs()
  const selectedItems = useEditorStore(s => s.selectedItems)
  const setSelectedItems = useEditorStore(s => s.setSelectedItems)
  const setCamera = useEditorStore(s => s.setCamera)
  const camera = useEditorStore(s => s.camera)
  const invalidateObject = useEditorStore(s => s.invalidateObject)
  const setSnapshots = useEditorStore(s => s.setSnapshots)

  /**
   * @private
   */
  function rebuildBlocklyUI() {
    const entries = Array.from(objectsRef.current.entries())
    blocklyUI.objectMenu = entries.map(([id, object]) => [object.name, id])
    workspaceRef.current?.updateToolbox(
      workspaceRef.current.options.languageTree
    )
  }

  /**
   * @private
   * Adds Helpers for specific objects
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

  /**
   * Adds an object to a desired target and returns its reference
   *
   * @param target Object3D to add it to, scene by default
   */
  function addObject(
    props: Optional<SObject3D, TransformProps>,
    target: Object3D = sceneRef.current,
    silent?: boolean
  ): Object3D {
    const object = createObject(props)
    applyProps(object, props)
    target.add(object)

    /** Add children */
    if (props.children) {
      for (const child of props.children) {
        addObject(child, object, true)
      }
    }

    /** Apply sharedId */
    const sharedId = props.sharedId ?? (nextSharedId++).toString()
    object.sharedId = sharedId
    if (props.sharedId) {
      const numeric = Number(sharedId)
      if (numeric >= nextSharedId) nextSharedId = numeric + 1
    }

    /** Add it to the registry */
    objectsRef.current.set(object.sharedId, object)

    /** Create snapshot */
    const snapshot = snapshotObject(object)
    setSnapshots(prev => {
      const targetId = target.sharedId
      if (targetId === undefined) {
        console.log(target.name, 'does not have a sharedid')
        throw new ObjectError(target, 'does not have a sharedId')
      }

      const targetSObject = prev[targetId]
      const childIds = [
        ...((targetSObject && targetSObject.childIds) || []),
        sharedId
      ]

      return {
        ...prev,
        [sharedId]: snapshot,
        [targetId]: {
          ...targetSObject,
          childIds
        }
      }
    })

    if (!silent) {
      setSelectedItems([object.sharedId])
      invalidateObject(object)
    }

    applyHelpers(object)
    rebuildBlocklyUI()
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

    invalidateObject(object)
    rebuildBlocklyUI()
  }

  function cloneObject(object: Object3D) {
    const parent = object.parent
    if (!parent) throw new ParentError(object)

    const sObject = serializeObject(object)
    const clone = addObject(sObject, parent)
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
    /*     
    setSnapshots(prev => ({
      ...prev,
      [targetId]: { ...prev[targetId], childIds: newChildren }
    }))

    wip: list before: [A,B,C,D] as ids
    -> if A gets dragged between B and C:
    first output: [B,C,D] 
    second output (why?): [B,A,C,D,A] (what is the A at the end doing?!)
    */
    console.log(itemIds, targetId, newChildren)

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
    const children = [...object.children]
    for (const child of children) {
      parent.add(child)
    }
    parent.remove(object)
    removeObject(object)

    /** @todo (#47) multiselect all children which were previously in the group */
    setSelectedItems([])
  }

  function copyObjects(objects: Object3D[]) {
    const sobjects = objects.map(object => serializeObject(object))
    const data = JSON.stringify(sobjects)
    navigator.clipboard.writeText(data)
  }

  async function pasteObjects(target: Object3D = sceneRef.current) {
    const text = await navigator.clipboard.readText()
    try {
      const objects: SObject3D[] = JSON.parse(text)
      for (let i = 0; i < objects.length; i++) {
        const object = addObject(objects[i], target, true)
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
    removeObject,
    cloneObject,
    moveObjects,
    groupObjects,
    unGroupObject,
    copyObjects,
    pasteObjects
  }
}
