import { ItemInstance } from '@headless-tree/core'

/**
 * Context Menu Props
 */
export interface ContextMenuProps {
  item?: ItemInstance<TreeItem>
  x: number
  y: number
}

/**
 * All Icons that are used by ItemIcon component
 */
export type IconT =
  | 'Puzzle'
  | 'Airplay'
  | 'PenTool'
  | 'Folder'
  | 'Wrench'
  | 'Box'
  | 'Component'
  | 'Sun'
  | 'Lightbulb'
  | 'Camera'
  | 'SquareSquare'
  | 'Settings'
  | 'Settings2'
  | 'Keyboard'
  | 'FileText'

/**
 * TreeItem: Representation of an Object in the Explorer Panel
 */
export interface TreeItem {
  name: string
  type: IconT
  hasChildren: boolean
}

export interface NotificationItemProps {
  title: string
  content?: string
  iconType?: IconT
}

export type ToolItem = 'move' | 'path'

export type EditorCommandT =
  /**
   * it's important to distinguish general keybinds (can be the same, e.g copy paste, but do different stuff across panels!!)
   */
  | 'openKeybinds'

  /** scene-specific */
  | 'copyObject'
  | 'pasteObject'
  | 'groupObject'
  | 'addObject'
  | 'removeObject'
  | 'cloneObject'

export interface EditorCommand {
  label: string
  run: () => void
}

export type EditorCommands = {
  [K in EditorCommandT]: EditorCommand
}
