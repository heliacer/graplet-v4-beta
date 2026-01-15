import {
  CameraHelper,
  DirectionalLightHelper,
  GridHelper,
  Object3D
} from 'three'
import {
  TransformControls,
  TransformControlsGizmo,
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
export function moveObject(object: Object3D, target: Object3D) {
  const parent = object.parent
  if (!parent) throw new ParentError(object)
  parent.remove(object)
  target.add(object)
}
