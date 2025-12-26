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

declare class TransformControlsRoot extends Object3D {
  readonly isTransformControlsRoot: true

  controls: TransformControls

  constructor(controls: TransformControls)

  dispose(): void
}

/**
 * @todo add all helpers to be ignored
 *
 * TransformControls get generated internally,
 * and Helpers are kind of a pain to implement with the current serialisation system.
 *
 * -> Adding helpers to the respective object userData seems like a better idea
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
  if (!parent) throw Error(`${object.name || 'Unnamed'} (${object.type}) does not have a parent`)
  parent.remove(object)
  target.add(object)
}
