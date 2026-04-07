import { useEditorRefs } from '../EditorContext'
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
import { ParentError, SObject3D, TransformProps } from '../types'
import { applyProps, createObject, serializeObject } from '../utils/sobject'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import {
  findTopLevelObject,
  getFallbackObject,
  moveObject
} from '../utils/three'
import { Optional } from '@/app/lib/types'
import { useEditorStore } from '../state'

let nextSharedId = 0

export function useObjectActions() {
  const { scene, objects, workspace, setObjectVersion, orbitMap, canvas } =
    useEditorRefs()
  const selectedItems = useEditorStore(s => s.selectedItems)
  const setSelectedItems = useEditorStore(s => s.setSelectedItems)
  const setCamera = useEditorStore(s => s.setCamera)
  const camera = useEditorStore(s => s.camera)

  /**
   * @private
   */
  function rebuildBlocklyUI() {
    const entries = Array.from(objects.current.entries())
    blocklyUI.objectMenu = entries.map(([id, object]) => [object.name, id])
    workspace.current?.updateToolbox(workspace.current.options.languageTree)
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
    props: Optional<SObject3D, TransformProps>,
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

    /**
     * Apply userData, sharedId and add to registry
     * @todo refactor and clean this shit
     */
    if (props.sharedId) {
      object.sharedId = props.sharedId
      /** Ensure no conflicts happen when adding more objects */
      const sharedId = Number(props.sharedId)
      if (sharedId >= nextSharedId) {
        nextSharedId = sharedId + 1
      }
    } else {
      object.sharedId = (nextSharedId++).toString()
    }

    objects.current.set(object.sharedId, object)
    applyHelpers(object)
    setSelectedItems([object.sharedId])
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

    if (object.sharedId) {
      /** Remove it from the registry */
      objects.current.delete(object.sharedId)

      /** If it's the selection, remove it */
      if (selectedItems.includes(object.sharedId)) {
        const fallback = getFallbackObject(parent)
        setSelectedItems(prev => {
          const next = prev.filter(item => item !== object.sharedId)
          return next.length === 0 && fallback.sharedId
            ? [fallback.sharedId]
            : next
        })
      }
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
    removeObject(object)

    /**
     * @todo multiselect all children which were previously in the group
     */
    setSelectedItems([])
  }

  function copyObjects(objects: Object3D[]) {
    const sobjects = objects.map(object => serializeObject(object))
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
