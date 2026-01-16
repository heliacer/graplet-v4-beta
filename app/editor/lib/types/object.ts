import { Object3D } from 'three'

class ObjectError extends Error {
  constructor(object: Object3D, message: string) {
    super(`${object.name || 'unnamed'} (${object.type}) ${message}`)
  }
}

/**
 * The given Object3D does not have a parent Object3D
 */
export class ParentError extends ObjectError {
  constructor(object: Object3D) {
    super(object, 'does not have a parent')
    this.name = 'ParentError'
  }
}

/**
 * The given Object3D was not found in the registry
 */
export class RegistryError extends ObjectError {
  constructor(object: Object3D) {
    super(object, 'was not found in the registry')
    this.name = 'RegistryError'
  }
}
