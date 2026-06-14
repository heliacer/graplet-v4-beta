type Vec3 = readonly [number, number, number]

/**
 * Serialized Object3D
 *
 * This is the state that snapshots
 * and serialized objects are found with
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
  position: Vec3
  rotation: Vec3
  scale: Vec3
  visible: boolean
  sharedId: string
  childIds: string[]
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
  color: string
  intensity: number
}

/** Serialized AmbientLight */
export interface SAmbientLight extends SBase {
  type: 'AmbientLight'
  color: string
  intensity: number
}

/** Serialized PerspectiveCamera */
export interface SPerspectiveCamera extends SBase {
  type: 'PerspectiveCamera'
  fov: number
  near: number
  far: number
}

/** Serialized PerspectiveCamera */
export interface SOrthographicCamera extends SBase {
  type: 'OrthographicCamera'
  near: number
  far: number
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
 * SObject Config
 *
 * This is used when constructing an object
 * where some properties can be undefined
 */
export type SObjectConfig =
  | SSceneConfig
  | SGroupConfig
  | SMeshConfig
  | SDirectionalLightConfig
  | SAmbientLightConfig
  | SPerspectiveCameraConfig
  | SOrthographicCameraConfig

type SBaseConfig = Partial<SBase> &
  Omit<SBase, 'childIds'> &
  Pick<SBase, 'name'> & { children?: SObject3D[] }

export type SSceneConfig = SBaseConfig & Partial<SScene> & Pick<SScene, 'type'>

export type SGroupConfig = SBaseConfig & Partial<SGroup> & Pick<SGroup, 'type'>

export type SMeshConfig = SBaseConfig &
  Partial<SMesh> &
  Pick<SMesh, 'type' | 'geometry' | 'material'>

export type SDirectionalLightConfig = SBaseConfig &
  Partial<SDirectionalLight> &
  Pick<SDirectionalLight, 'type'>

export type SAmbientLightConfig = SBaseConfig &
  Partial<SAmbientLight> &
  Pick<SAmbientLight, 'type'>

export type SPerspectiveCameraConfig = SBaseConfig &
  Partial<SPerspectiveCamera> &
  Pick<SPerspectiveCamera, 'type'>

export type SOrthographicCameraConfig = SBaseConfig &
  Partial<SOrthographicCamera> &
  Pick<SOrthographicCamera, 'type'>
