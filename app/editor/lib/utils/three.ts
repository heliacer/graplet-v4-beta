import {
  CameraHelper,
  DirectionalLightHelper,
  GridHelper,
  Object3D,
  Scene
} from 'three'
import {
  TransformControls,
  TransformControlsGizmo,
  TransformControlsMode,
  TransformControlsPlane
} from 'three/examples/jsm/Addons.js'
import { ParentError } from '../types'

declare class TransformControlsRoot extends Object3D {
  readonly isTransformControlsRoot: true

  controls: TransformControls

  constructor(controls: TransformControls)

  dispose(): void
}

/**
 * @todo Add all helpers to be ignored
 *
 * TransformControls get generated internally,
 * and Helpers are kind of a pain to implement with the current serialization system.
 *
 * (1) Adding helpers to the respective object userData seems like a better idea
 *
 * (2) Or even better, pass the helpersMap<Object3D, HelperObject3D>
 *     and register them here and just have them in the SObject props :D
 */
export function isInternalObject(object: Object3D): boolean {
  return (
    object instanceof TransformControlsGizmo ||
    object instanceof TransformControlsPlane ||
    object instanceof CameraHelper ||
    object instanceof GridHelper ||
    object instanceof DirectionalLightHelper ||
    (object as TransformControlsRoot).isTransformControlsRoot
  )
}

/**
 * Removes the object from its parent object and adds it to the target group
 */
export function moveObject(object: Object3D, target: Object3D | Scene) {
  const parent = object.parent
  if (!parent) throw new ParentError(object)
  parent.remove(object)
  target.add(object)
}

export function isTransformControlsMode(
  value: string
): value is TransformControlsMode {
  return value === 'translate' || value === 'rotate' || value === 'scale'
}

export function findTopLevelObject(
  objects: Object3D[],
  scene: Scene
): Object3D {
  if (objects.length === 0) throw Error('An Empty object list serves me shit')
  const objectSet = new Set(objects)

  for (const object of objects) {
    let parent = object.parent
    if (!parent) throw new ParentError(object)

    let isTopLevel = true

    while (parent !== scene) {
      /** another selected object is above us, oh no we lost :< */
      if (objectSet.has(parent)) {
        isTopLevel = false
        break
      }

      if (!parent.parent) throw new ParentError(parent)
      parent = parent.parent
    }
    if (isTopLevel) {
      return object
    }
  }
  throw Error('How did we get there?')
}

export function getFallbackObject(object: Object3D) {
  if (object.children.length > 0) {
    const child = [...object.children].reverse().find(c => !isInternalObject(c))
    if (child) {
      return child
    }
  }
  const parent = object.parent
  if (!parent) throw new ParentError(object)
  return parent
}
