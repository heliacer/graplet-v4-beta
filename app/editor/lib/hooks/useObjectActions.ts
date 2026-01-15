import { useEditor } from '../EditorContext'
import {
  Camera,
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  Object3D,
  PerspectiveCamera
} from 'three'
import { blocklyUI } from '../blockly/blocks'
import { ParentError, SObject3D } from '../types'
import { applyProps, createObject, serializeObject } from '../utils/sobject'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { isInternalObject, moveObject } from '../utils/three'

let nextId = 0

export function useObjectActions() {
  const {
    scene,
    objects,
    currentObject,
    workspace,
    camera,
    setCamera,
    setCurrentObject,
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

    applyHelpers(object)
    setCurrentObject(object)

    /** Add it to the registry */
    objects.current.set((nextId++).toString(), object)

    rebuildBlocklyUI()
    setObjectVersion((v) => v + 1)
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

    /** If it's the current object, set another one as current */
    if (object === currentObject) {
      if (parent.children.length > 0) {
        const child = [...parent.children]
          .reverse()
          .find((c) => !isInternalObject(c))
        setCurrentObject(child || null)
      } else {
        setCurrentObject(parent)
      }
    }

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
    const entry = Array.from(objects.current.entries()).find(
      ([, obj]) => obj === object
    )
    if (!entry)
      throw Error(
        `${object.name || 'unnamed'} (${object.type}) was not found in the registry.`
      )
    const [id] = entry
    objects.current.delete(id)

    rebuildBlocklyUI()
    setObjectVersion((v) => v + 1)
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
    setCurrentObject(clone)

    /** Add it to the registry */
    objects.current.set((nextId++).toString(), clone)

    rebuildBlocklyUI()
    setObjectVersion((v) => v + 1)
  }

  function groupObject(object: Object3D) {
    const parent = object.parent
    if (!parent) throw new ParentError(object)
    const target = addObject({ type: 'Group', name: 'Group' }, parent)
    moveObject(object, target)
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
    setCurrentObject(null)
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
      objects.forEach((object) => addObject(object, target))
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
    groupObject,
    unGroupObject,
    copyObjects,
    pasteObjects
  }
}
