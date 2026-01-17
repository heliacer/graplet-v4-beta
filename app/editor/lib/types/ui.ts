import { ItemInstance } from '@headless-tree/core'

/**
 * Context Menu Props
 * @todo Allow multiple items to be manipulated
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
