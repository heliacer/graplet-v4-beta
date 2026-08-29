import { Object3D } from 'three'
import { SObjectConfig } from './sobject'

export class ObjectError extends Error {
  constructor(object: Object3D, message: string) {
    super(`${object.name || 'unnamed'} (${object.type}) ${message}`)
  }
}

export class NotFoundError extends Error {
  constructor(sharedId?: string) {
    super(`Object ${sharedId} was not found in the registry`)
    this.name = 'NotFoundError'
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
 * @todo (#36) Keybinds (here: Undo/Redo)
 *
 * For now, only holds objects in history entries.
 *
 * Consider NOT generalising history entry,
 * as blockly already has its own. maybe spearated
 * history is better than a general history entry.,
 */
export type HistoryEntry =
  ObjectUpdateEntry | ObjectCreateEntry | ObjectDeleteEntry

type BaseEntry = {
  sharedId: string
}

export type ObjectUpdateEntry = BaseEntry & {
  type: 'update'
  change: Partial<SObjectConfig>
  revert: Partial<SObjectConfig>
}

export type ObjectCreateEntry = BaseEntry & {
  type: 'create'
}

export type ObjectDeleteEntry = BaseEntry & {
  type: 'delete'
  config: SObjectConfig
}
