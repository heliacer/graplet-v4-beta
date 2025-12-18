import { ItemInstance } from '@headless-tree/core'
import { TreeItem } from '../components/ui/TreeItemView'

type Vec3 = readonly [number, number, number]

export interface ProjectData {
  workspace: Record<string, unknown>
  scene: SScene
}

/**
 * Serialized Object3D
 */
export type SObject3D =
  | SScene
  | SGroup
  | SMesh
  | SDirectionalLight
  | SAmbientLight
  | SPerspectiveCamera
  | SOrthographicCamera

/**
 * Serialized Object3D Base
 */
export interface SBase {
  name: string
  position?: Vec3
  rotation?: Vec3
  scale?: Vec3
  children?: readonly SObject3D[]
}

/** Serialized Scene */
export interface SScene extends SBase {
  type: 'Scene'
}

/** Serialized Group */
export interface SGroup extends SBase {
  type: 'Group'
}

/** Serialized Mesh */
export interface SMesh extends SBase {
  type: 'Mesh'
  geometry: SGeometry
  material: SMaterial
}

/** Serialized DirectionalLight */
export interface SDirectionalLight extends SBase {
  type: 'DirectionalLight'
  color?: string
  intensity?: number
}

/** Serialized AmbientLight */
export interface SAmbientLight extends SBase {
  type: 'AmbientLight'
  color?: string
  intensity?: number
}

/** Serialized PerspectiveCamera */
export interface SPerspectiveCamera extends SBase {
  type: 'PerspectiveCamera'
  fov?: number
  near?: number
  far?: number
}

/** Serialized PerspectiveCamera */
export interface SOrthographicCamera extends SBase {
  type: 'OrthographicCamera'
  near?: number
  far?: number
}

/** Serialized Geometry type */
export type SGeometryT =
  | 'BoxGeometry'
  | 'SphereGeometry'
  | 'PlaneGeometry'
  | 'CircleGeometry'
  | 'CylinderGeometry'
  | 'ConeGeometry'
  | 'RingGeometry'
  | 'DodecahedronGeometry'
  | 'OctahedronGeometry'
  | 'IcosahedronGeometry'
  | 'TetrahedronGeometry'
  | 'TorusGeometry'
  | 'TorusKnotGeometry'

/** Serialized Object3D Geometry */
export interface SGeometry {
  type: SGeometryT
  args: number[]
}

/**
 * Serialized Object3D Material
 */
export interface SMaterial {
  type: 'MeshBasicMaterial' | 'MeshStandardMaterial' | 'MeshToonMaterial'
  color?: string
}

/**
 * Context Menu Props
 * @todo add more, e.g source
 */
export interface ContextMenuProps {
  item: ItemInstance<TreeItem>
  x: number
  y: number
}
