import { useEditor } from '../EditorContext'
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
import { ObjectUserData, ParentError, RegistryError, SObject3D } from '../types'
import { applyProps, createObject, serializeObject } from '../utils/sobject'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import {
  findTopLevelObject,
  getFallbackObject,
  isInternalObject,
  moveObject
} from '../utils/three'

let nextId = 0

export function useObjectActions() {
  const {
    scene,
    objects,
    objectIds,
    selectedItems,
    setSelectedItems,
    workspace,
    camera,
    setCamera,
    setObjectVersion,
    orbitMap,
    canvas
  } = useEditor()

  /**
   * @private
   */
  function rebuildBlocklyUI() {
    const entries = Array.from(objects.current.entries())
    blocklyUI.objectMenu = entries.map(([id, object]) => [object.name, id])
    workspace?.refreshToolboxSelection()
  }

  /**
   * @private
   * Adds Helpers for specific objects
   */
  function applyHelpers(object: Object3D) {
    if (object instanceof Camera) {
      const helper = new CameraHelper(object)
      helper.name = 'CameraHelper'
      if (object instanceof PerspectiveCamera && orbitMap.current.size === 0) {
        setCamera(object)
        const controls = new OrbitControls(object, canvas.current)
        controls.mouseButtons = {
          MIDDLE: MOUSE.PAN,
          RIGHT: MOUSE.ROTATE
        }
        orbitMap.current.set(object.id, controls)
        helper.visible = false
      }
      scene.current.add(helper)
    }
    if (object instanceof DirectionalLight) {
      const helper = new DirectionalLightHelper(object)
      helper.name = 'DirectionalLightHelper'
      scene.current.add(helper)
    }
  }

  /**
   * Adds an object to a desired target and returns its reference
   *
   * @param target Object3D to add it to, scene by default
   */
  function addObject(
    props: SObject3D,
    target: Object3D = scene.current
  ): Object3D {
    const object = createObject(props)
    applyProps(object, props)
    target.add(object)
    console.info(
      `%c${object.name} was added to ${target.name || target.type}`,
      'color: aquamarine;'
    )

    /** Add children */
    if (props.children) {
      for (const child of props.children) {
        addObject(child, object)
      }
    }

    /** Add it to the registry */
    const id = (nextId++).toString()
    objects.current.set(id, object)
    objectIds.current.set(object, id)

    /** @todo needs testing */
    const userData: ObjectUserData = {
      sharedId: id
    }
    object.userData = userData

    applyHelpers(object)
    setSelectedItems([id])
    setObjectVersion(v => v + 1)
    rebuildBlocklyUI()
    return object
  }

  /**
   * Removes an object from its parent and disposes of everything associated with it
   *
   * @todo Dispose of geometry & material after removing (disposeObject)
   * @todo Delete helpers if they have them
   */
  function removeObject(object: Object3D) {
    const parent = object.parent
    if (!parent) throw new ParentError(object)
    parent.remove(object)

    if (object instanceof Camera) {
      /** If it's the active camera, set another one active instead */
      if (object === camera) {
        const nextCamera = scene.current.getObjectByProperty(
          'isCamera',
          true
        ) as Camera
        setCamera(nextCamera || null)
      }
      /** If the camera has orbit controls, dispose of them */
      const orbit = orbitMap.current.get(object.id)
      if (orbit) {
        orbit.disconnect()
        orbit.dispose()
        orbitMap.current.delete(object.id)
      }
    }

    /** Remove it from the registry */
    const id = objectIds.current.get(object)
    if (id) {
      objects.current.delete(id)
      objectIds.current.delete(object)

      /** If it's the selection, remove it */
      if (selectedItems.includes(id)) {
        const fallback = getFallbackObject(parent)
        const fallbackId = objectIds.current.get(fallback)
        setSelectedItems(prev => {
          const next = prev.filter(item => item !== id)
          return next.length === 0 && fallbackId ? [fallbackId] : next
        })
      }
    } else if (!isInternalObject(object)) {
      throw new RegistryError(object)
    }

    setObjectVersion(v => v + 1)
    rebuildBlocklyUI()
  }

  /**
   * @todo Should separate geometry & material, since those are shared by default -> option to keep them / make new
   * @todo Also add helpers if needed
   */
  function cloneObject(object: Object3D) {
    const parent = object.parent
    if (!parent) throw new ParentError(object)

    const clone = object.clone()
    clone.position.x += 2

    parent.add(clone)

    /** Add it to the registry */
    const id = (nextId++).toString()
    objects.current.set(id, clone)
    objectIds.current.set(clone, id)

    setSelectedItems([id])
    setObjectVersion(v => v + 1)
    rebuildBlocklyUI()
  }

  function groupObjects(objects: Object3D[]) {
    if (objects.length === 0) return
    const firstParent = objects[0].parent
    if (!firstParent) throw new ParentError(objects[0])
    const parent =
      objects.length === 1
        ? firstParent
        : findTopLevelObject(objects, scene.current)
    const target = addObject({ type: 'Group', name: 'Group' }, parent)
    for (const object of objects) {
      moveObject(object, target)
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

    /**
     * @todo multiselect all children which were previously in the group
     */
    setSelectedItems([])
  }

  function copyObjects(objects: Object3D[]) {
    const sobjects = objects.map(serializeObject)
    const data = JSON.stringify(sobjects)
    navigator.clipboard.writeText(data)
  }

  async function pasteObjects(target: Object3D) {
    /** @todo this is too primitive, needs to be a bit safer and check the clipboard values */

    const text = await navigator.clipboard.readText()
    try {
      const objects: SObject3D[] = JSON.parse(text)
      objects.forEach(object => addObject(object, target))
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.warn('invalid paste just happened')
      } else {
        console.error(error)
      }
    }
  }

  return {
    addObject,
    removeObject,
    cloneObject,
    groupObjects,
    unGroupObject,
    copyObjects,
    pasteObjects
  }
}
