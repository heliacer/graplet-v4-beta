import {
  TransformControls,
  TransformControlsGizmo,
  TransformControlsPlane
} from 'three/examples/jsm/Addons.js'
import { SGeometry, SObject3D, SMaterial, SBase } from '../types'
import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CameraHelper,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  DodecahedronGeometry,
  GridHelper,
  Group,
  IcosahedronGeometry,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  Object3D,
  OctahedronGeometry,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  RingGeometry,
  Scene,
  SphereGeometry,
  TetrahedronGeometry,
  TorusGeometry,
  TorusKnotGeometry
} from 'three'

declare class TransformControlsRoot extends Object3D {
  readonly isTransformControlsRoot: true

  controls: TransformControls

  constructor(controls: TransformControls)

  dispose(): void
}

/** @todo add all helpers */
export function isInternalObject(object: Object3D): boolean {
  return (
    object instanceof TransformControlsGizmo ||
    object instanceof TransformControlsPlane ||
    object instanceof CameraHelper ||
    object instanceof GridHelper ||
    /** Light Helpers */
    object instanceof DirectionalLightHelper ||
    (object as TransformControlsRoot).isTransformControlsRoot
  )
}

/**
 * creates a Object3D from serialization
 * @example
 * const object = createObject({
 *   type: 'Mesh',
 *   geometry: {
 *     type: 'BoxGeometry',
 *     args: [1,1,1]
 *   },
 *   material: {
 *     color: '#ffffff'
 *   }
 * })
 */
export function createObject(props: SObject3D) {
  switch (props.type) {
    case 'Scene': {
      return new Scene()
    }
    case 'Group': {
      return new Group()
    }
    case 'Mesh': {
      return new Mesh(
        createGeometry(props.geometry),
        createMaterial(props.material)
      )
    }
    case 'DirectionalLight': {
      const { color, intensity } = props
      return new DirectionalLight(color, intensity)
    }
    case 'AmbientLight': {
      const { color, intensity } = props
      return new AmbientLight(color, intensity)
    }
    case 'PerspectiveCamera': {
      const { fov, near, far } = props
      return new PerspectiveCamera(fov, 1, near, far)
    }
    case 'OrthographicCamera': {
      const { near, far } = props
      return new OrthographicCamera(-1, 1, 1, -1, near, far)
    }
  }
}

export function applyProps(object: Object3D, props: SObject3D) {
  const { type, name, rotation, scale, position } = props

  /** Ensure Object and Serialized Props are of same type */
  if (object.type !== type) throw Error('Object must be of same type as props')

  if (name) object.name = name
  if (rotation) object.rotation.set(...rotation)
  if (scale) object.scale.set(...scale)
  if (position) object.position.set(...position)

  if (object instanceof Scene && props.type === 'Scene') {
    /** nothing for now */
  }
  if (object instanceof Group && props.type === 'Group') {
    /** nothing for now */
  }
  if (object instanceof Mesh && props.type === 'Mesh') {
    /** @todo */
  }
  if (object instanceof AmbientLight && props.type === 'AmbientLight') {
    /** @todo */
  }
  if (object instanceof DirectionalLight && props.type === 'DirectionalLight') {
    /** @todo */
  }
  if (
    object instanceof PerspectiveCamera &&
    props.type === 'PerspectiveCamera'
  ) {
    /** @todo */
  }
  if (
    object instanceof OrthographicCamera &&
    props.type === 'OrthographicCamera'
  ) {
    /** @todo */
  }
}

const geometryFactory: Record<
  SGeometry['type'],
  (args: number[]) => BufferGeometry
> = {
  BoxGeometry: (a) => new BoxGeometry(...a),
  SphereGeometry: (a) => new SphereGeometry(...a),
  PlaneGeometry: (a) => new PlaneGeometry(...a),
  CircleGeometry: (a) => new CircleGeometry(...a),
  CylinderGeometry: (a) => new CylinderGeometry(...a),
  ConeGeometry: (a) => new ConeGeometry(...a),
  RingGeometry: (a) => new RingGeometry(...a),
  DodecahedronGeometry: (a) => new DodecahedronGeometry(...a),
  OctahedronGeometry: (a) => new OctahedronGeometry(...a),
  IcosahedronGeometry: (a) => new IcosahedronGeometry(...a),
  TetrahedronGeometry: (a) => new TetrahedronGeometry(...a),
  TorusGeometry: (a) => new TorusGeometry(...a),
  TorusKnotGeometry: (a) => new TorusKnotGeometry(...a)
}

function createGeometry(geometry: SGeometry): BufferGeometry {
  const make = geometryFactory[geometry.type]
  if (!make) throw new Error(`Unsupported geometry type: ${geometry.type}`)
  return make(geometry.args)
}

function createMaterial(material: SMaterial): Material {
  const { type, color } = material
  switch (type) {
    case 'MeshBasicMaterial': {
      return new MeshBasicMaterial({ color })
    }
    case 'MeshStandardMaterial': {
      return new MeshStandardMaterial({ color })
    }
    case 'MeshToonMaterial': {
      return new MeshToonMaterial({ color })
    }
  }
}

/**
 * Serializes an object with its metadata
 */
export function serializeObject(object: Object3D): SObject3D {
  /** Common Props */
  const { name, position, rotation, scale } = object
  const children = object.children
    .filter((child) => !isInternalObject(child))
    .map(serializeObject) as readonly SObject3D[]

  const base: SBase = {
    name,
    position: [position.x, position.y, position.z],
    rotation: [rotation.x, rotation.y, rotation.z],
    scale: [scale.x, scale.y, scale.z],
    ...(children.length > 0 && { children })
  }

  /** Specific Props */
  if (object instanceof Scene) {
    return {
      type: 'Scene',
      ...base
    }
  }
  if (object instanceof Group) {
    return {
      type: 'Group',
      ...base
    }
  }
  if (object instanceof Mesh) {
    const color = object.material.color as Color
    return {
      type: 'Mesh',
      material: {
        type: object.material.type,
        color: `#${color.getHexString()}`
      },
      geometry: {
        type: object.geometry.type,
        args: Object.values(object.geometry.parameters)
      },
      ...base
    }
  }
  if (object instanceof AmbientLight) {
    return {
      type: 'AmbientLight',
      intensity: object.intensity,
      ...base
    }
  }
  if (object instanceof DirectionalLight) {
    return {
      type: 'DirectionalLight',
      intensity: object.intensity,
      ...base
    }
  }
  if (object instanceof PerspectiveCamera) {
    const { fov, near, far } = object
    return {
      type: 'PerspectiveCamera',
      fov,
      near,
      far,
      ...base
    }
  }
  if (object instanceof OrthographicCamera) {
    const { near, far } = object
    return {
      type: 'OrthographicCamera',
      near,
      far,
      ...base
    }
  }
  throw new Error(
    `Unsupported Object3D: ${object.constructor.name} ${object.type}`
  )
}
