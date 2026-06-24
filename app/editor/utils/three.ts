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

export function getObject(
  objectsRef: RefObject<Map<string, Object3D>>,
  sharedId: string
): Object3D {
  const object = objectsRef.current.get(sharedId)
  if (object === undefined) throw new NotFoundError(sharedId)
  return object
}

/**
 * @todo (#34) Scene UX Controls
 * -> redo, see useRenderer
 * 
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
