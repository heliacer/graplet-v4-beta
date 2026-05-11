import {
  CameraHelper,
  DirectionalLightHelper,
  GridHelper,
  Object3D,
  Scene
} from 'three'
import { NotFoundError, ParentError } from '../types'
import {
  TransformControls,
  TransformControlsGizmo,
  TransformControlsMode,
  TransformControlsPlane
} from 'three/examples/jsm/controls/TransformControls.js'
import { RefObject } from 'react'

declare class TransformControlsRoot extends Object3D {
  readonly isTransformControlsRoot: true

  controls: TransformControls

  constructor(controls: TransformControls)

  dispose(): void
}

/**
 * @todo (#65) ObjectView: Revamp helpers
 *
 * Add all helpers to be ignored
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

export function getObject(
  objectsRef: RefObject<Map<string, Object3D>>,
  sharedId: string
): Object3D {
  const object = objectsRef.current.get(sharedId)
  if (object === undefined) throw new NotFoundError(sharedId)
  return object
}
