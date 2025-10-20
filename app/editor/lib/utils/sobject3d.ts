import {
  SGeometry,
  SObject3D,
  SMaterial,
  SObject3DT,
  SGeometryT
} from '../types'
import {
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  Group,
  IcosahedronGeometry,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  OctahedronGeometry,
  PlaneGeometry,
  RingGeometry,
  SphereGeometry,
  TetrahedronGeometry,
  TorusGeometry,
  TorusKnotGeometry
} from 'three'

/**
 * Adds a serialized Object3D
 * @example
 * createObject({
 *   type: 'Mesh',
 *   geometry: {
 *     type: 'Box',
 *     args: [1,1,1]
 *   },
 *   material: {
 *     color: '#ffffff'
 *   }
 * }, scene)
 */
export function addObject(props: SObject3D, dest?: Object3D): Object3D {
  const obj = buildObjectTree(props)
  dest?.add(obj)
  return obj
}

function buildObjectTree(node: SObject3D): Object3D {
  const obj = createObject(node)
  applyInitialProps(obj, node)

  for (const child of node.children ?? []) {
    const childObj = buildObjectTree(child)
    obj.add(childObj)
  }
  return obj
}

function applyInitialProps(
  obj: Object3D,
  props: Pick<SObject3D, 'name' | 'position' | 'rotation' | 'scale'>
) {
  const { name, position, rotation, scale } = props
  if (name) obj.name = name
  if (position) obj.position.set(...position)
  if (rotation) obj.rotation.set(...rotation)
  if (scale) obj.scale.set(...scale)
}

const geometryFactory: Record<
  SGeometry['type'],
  (args: number[]) => BufferGeometry
> = {
  Box: (a) => new BoxGeometry(...a),
  Sphere: (a) => new SphereGeometry(...a),
  Plane: (a) => new PlaneGeometry(...a),
  Circle: (a) => new CircleGeometry(...a),
  Cylinder: (a) => new CylinderGeometry(...a),
  Cone: (a) => new ConeGeometry(...a),
  Ring: (a) => new RingGeometry(...a),
  Dodecahedron: (a) => new DodecahedronGeometry(...a),
  Octahedron: (a) => new OctahedronGeometry(...a),
  Icosahedron: (a) => new IcosahedronGeometry(...a),
  Tetrahedron: (a) => new TetrahedronGeometry(...a),
  Torus: (a) => new TorusGeometry(...a),
  TorusKnot: (a) => new TorusKnotGeometry(...a)
}

function createGeometry(geometry: SGeometry): BufferGeometry {
  const make = geometryFactory[geometry.type]
  if (!make) throw new Error(`Unsupported geometry type: ${geometry.type}`)
  return make(geometry.args)
}

function createMaterial(m: SMaterial): Material {
  return new MeshStandardMaterial({ color: m.color })
}

function createObject(
  props: Pick<SObject3D, 'type' | 'geometry' | 'material'>
) {
  const { type, geometry, material } = props
  switch (type) {
    case 'Mesh': {
      if (!geometry) throw Error('Mesh is missing geometry')
      if (!material) throw Error('Mesh is missing material')
      return new Mesh(createGeometry(geometry), createMaterial(material))
    }
    case 'Group': {
      return new Group()
    }
  }
}

/**
 * @todo
 */
export function updateObject(
  props: Omit<SObject3D, 'geometry' | 'type'>,
  dest: Object3D
) {
  console.log(props, dest)
}

/**
 * Serializes an object with its metadata
 */
export function serializeObject(object: Object3D): SObject3D {
  /** Common Props */
  const { type, name, position, rotation, scale } = object
  const sObject: SObject3D = {
    type: type as SObject3DT,
    name,
    position: [position.x, position.y, position.z],
    rotation: [rotation.x, rotation.y, rotation.z],
    scale: [scale.x, scale.y, scale.z]
  }

  /** Specific Props */
  if (object instanceof Group) {
    // nothing for now
  }
  if (object instanceof Mesh) {
    const color = object.material.color as Color

    /** @todo this is bs, types need probably entire type, not aliases (slices) */
    sObject.geometry = {
      type: object.geometry.type.slice(0, -8) as SGeometryT,
      args: Object.values(object.geometry.parameters)
    }
    sObject.material = {
      type: object.material.type.slice(4, -8),
      color: color.getHexString()
    }
  }

  /** Children */
  if (object.children.length > 0) {
    sObject.children = []
    for (const child of object.children) {
      const sChild = serializeObject(child)
      sObject.children.push(sChild)
    }
  }

  return sObject
}
