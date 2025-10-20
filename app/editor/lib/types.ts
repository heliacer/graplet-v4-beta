export interface ProjectData {
  workspace: { [key: string]: any } // eslint-disable-line @typescript-eslint/no-explicit-any
  scene: {
    objects: SObject3D[]
  }
}

/**
 * Serialized Object3D Type
 */
export type SObject3DT = 'Mesh' | 'Group'

/**
 * Serialized Object3D
 */
export interface SObject3D {
  type: SObject3DT
  name: string
  geometry?: SGeometry
  material?: SMaterial
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  children?: SObject3D[]
}

export type SGeometryT =
  | 'Box'
  | 'Sphere'
  | 'Plane'
  | 'Circle'
  | 'Cylinder'
  | 'Cone'
  | 'Ring'
  | 'Dodecahedron'
  | 'Octahedron'
  | 'Icosahedron'
  | 'Tetrahedron'
  | 'Torus'
  | 'TorusKnot'
/**
 * Serialized Object3D Geometry
 */
export interface SGeometry {
  type: SGeometryT
  args: number[]
}

/**
 * Serialized Object3D Material
 */
export interface SMaterial {
  type: 'Standard' | 'Basic'
  color?: string
}
