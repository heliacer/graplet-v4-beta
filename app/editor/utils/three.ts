import { Object3D, Scene } from 'three'
import { NotFoundError, ParentError } from '../types'
import { TransformControlsMode } from 'three/addons/controls/TransformControls.js'
import { RefObject } from 'react'

/**
 * Removes the object from its parent object and adds it to the target group
 *
 * @deprecated, should be unified in objectactions and update the relative snapshots
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

/**
 * @todo replace with snapshot-friendly approach
 */
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

/**
 * Walks up from a raycast hit to find the direct child
 * of the given level object, returning its sharedId.
 * Returns undefined if the object is not a descendant of level.
 */
export function resolveToLevel(
  object: Object3D,
  level: Object3D
): string | undefined {
  let current = object
  while (current.parent !== null) {
    if (current.parent === level) return current.sharedId
    current = current.parent
  }
  return undefined
}
