import {
  Box,
  Camera,
  Component,
  FileText,
  Lightbulb,
  LucideIcon,
  SquareSquare,
  Sun
} from 'lucide-react'

export type IconT =
  | 'Group'
  | 'Mesh'
  | 'DirectionalLight'
  | 'AmbientLight'
  | 'PerspectiveCamera'
  | 'OrthographicCamera'
  | 'TextFile'

const ItemIcons: Record<IconT, LucideIcon> = {
  Mesh: Box,
  Group: Component,
  AmbientLight: Sun,
  DirectionalLight: Lightbulb,
  PerspectiveCamera: Camera,
  OrthographicCamera: SquareSquare,
  TextFile: FileText
}

export function Object3DIcon({
  iconType,
  ...props
}: { iconType: IconT } & React.ComponentProps<LucideIcon>) {
  const Icon = ItemIcons[iconType]
  return <Icon {...props} />
}
