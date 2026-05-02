import {
  Airplay,
  Box,
  Camera,
  Component,
  FileText,
  Folder,
  Keyboard,
  Lightbulb,
  LucideIcon,
  PenTool,
  Puzzle,
  Settings,
  Settings2,
  SquareSquare,
  Sun,
  Wrench
} from 'lucide-react'
import { IconT } from '../types'

const ItemIcons: Record<IconT, LucideIcon> = {
  Puzzle,
  Airplay,
  PenTool,
  Folder,
  Wrench,
  Box,
  Component,
  Sun,
  Lightbulb,
  Camera,
  SquareSquare,
  Settings,
  Settings2,
  Keyboard,
  FileText
}

export function ItemIcon({
  iconType,
  ...props
}: { iconType: IconT } & React.ComponentProps<LucideIcon>) {
  const Icon = ItemIcons[iconType]
  return <Icon {...props} />
}

export function getIconT(type: string): IconT {
  switch (type) {
    case 'Group':
      return 'Component'
    case 'Mesh':
      return 'Box'
    case 'AmbientLight':
      return 'Sun'
    case 'DirectionalLight':
      return 'Lightbulb'
    case 'PerspectiveCamera':
      return 'Camera'
    case 'OrthographicCamera':
      return 'SquareSquare'
    default:
      return 'FileText'
  }
}
