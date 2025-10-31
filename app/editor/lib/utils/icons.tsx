import {
  Airplay,
  Box,
  Camera,
  Component,
  FileText,
  Folder,
  Lightbulb,
  LucideIcon,
  PenTool,
  Puzzle,
  SquareSquare,
  Sun,
  Wrench
} from 'lucide-react'

export type IconT =
  | 'Puzzle'
  | 'Airplay'
  | 'PenTool'
  | 'Folder'
  | 'Wrench'

  /* Special Mappings for Object3D type */
  | 'Group'
  | 'Mesh'
  | 'DirectionalLight'
  | 'AmbientLight'
  | 'PerspectiveCamera'
  | 'OrthographicCamera'
  | 'TextFile'

const ItemIcons: Record<IconT, LucideIcon> = {
  Puzzle,
  Airplay,
  PenTool,
  Folder,
  Wrench,

  /* Special Mappings for Object3D type */
  Mesh: Box,
  Group: Component,
  AmbientLight: Sun,
  DirectionalLight: Lightbulb,
  PerspectiveCamera: Camera,
  OrthographicCamera: SquareSquare,
  TextFile: FileText
}

export function ItemIcon({
  iconType,
  ...props
}: { iconType: IconT } & React.ComponentProps<LucideIcon>) {
  const Icon = ItemIcons[iconType]
  return <Icon {...props} />
}
