import {
  SGeometry,
  SObject3D,
  SMaterial,
  SObjectConfig,
  SObjectSnapshot
} from '../types'
import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DodecahedronGeometry,
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
export function createObject(props: SObjectConfig) {
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

export function applyProps(object: Object3D, props: SObjectConfig) {
  const { type, name, visible, rotation, scale, position } = props

  /** Ensure Object and Serialized Props are of same type */
  if (object.type !== type) throw Error('Object must be of same type as props')

  if (name) object.name = name
  if (visible !== undefined) object.visible = visible
  if (rotation !== undefined) object.rotation.set(...rotation)
  if (scale !== undefined) object.scale.set(...scale)
  if (position !== undefined) object.position.set(...position)
}

/** @todo (#70) Specific args instead of args array in geometry args */
const geometryFactory: Record<
  SGeometry['type'],
  (args: number[]) => BufferGeometry
> = {
  BoxGeometry: a => new BoxGeometry(...a),
  SphereGeometry: a => new SphereGeometry(...a),
  PlaneGeometry: a => new PlaneGeometry(...a),
  CircleGeometry: a => new CircleGeometry(...a),
  CylinderGeometry: a => new CylinderGeometry(...a),
  ConeGeometry: a => new ConeGeometry(...a),
  RingGeometry: a => new RingGeometry(...a),
  DodecahedronGeometry: a => new DodecahedronGeometry(...a),
  OctahedronGeometry: a => new OctahedronGeometry(...a),
  IcosahedronGeometry: a => new IcosahedronGeometry(...a),
  TetrahedronGeometry: a => new TetrahedronGeometry(...a),
  TorusGeometry: a => new TorusGeometry(...a),
  TorusKnotGeometry: a => new TorusKnotGeometry(...a)
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

export function createObjectSnapshot(
  config: SObjectConfig,
  sharedId: string,
  parentId: string,
  childIds: string[]
): SObjectSnapshot {
  const base = {
    sharedId,
    parentId,
    childIds,

    name: config.name,
    position: config.position ?? [0, 0, 0],
    rotation: config.rotation ?? [0, 0, 0],
    scale: config.scale ?? [1, 1, 1],
    visible: config.visible ?? true
  }

  switch (config.type) {
    case 'Scene':
      return {
        ...base,
        type: 'Scene'
      }

    case 'Group':
      return {
        ...base,
        type: 'Group'
      }

    case 'Mesh':
      return {
        ...base,
        type: 'Mesh',
        geometry: config.geometry,
        material: config.material
      }

    case 'DirectionalLight':
      return {
        ...base,
        type: 'DirectionalLight',
        color: config.color ?? '#ffffff',
        intensity: config.intensity ?? 1
      }

    case 'AmbientLight':
      return {
        ...base,
        type: 'AmbientLight',
        color: config.color ?? '#ffffff',
        intensity: config.intensity ?? 1
      }

    case 'PerspectiveCamera':
      return {
        ...base,
        type: 'PerspectiveCamera',
        fov: config.fov ?? 50,
        near: config.near ?? 0.1,
        far: config.far ?? 2000
      }

    case 'OrthographicCamera':
      return {
        ...base,
        type: 'OrthographicCamera',
        near: config.near ?? 0.1,
        far: config.far ?? 2000
      }
  }
}

export function snapshotToConfig(
  sharedId: string,
  snapshots: Record<string, SObjectSnapshot>
): SObjectConfig {
  const snapshot = snapshots[sharedId]

  if (!snapshot) {
    const msg = `snapshotToConfig: sharedId "${sharedId}" doesn't exist in snapshots`
    throw Error(msg)
  }

  /** Strip metadata from snapshot */
  const sobject = Object.fromEntries(
    Object.entries(snapshot).filter(
      ([key]) => key !== 'sharedId' && key !== 'parentId' && key !== 'childIds'
    )
  ) as SObject3D

  const config: SObjectConfig = {
    ...sobject,
    children: []
  }

  if (snapshot.childIds.length) {
    config.children = snapshot.childIds.map(childId =>
      snapshotToConfig(childId, snapshots)
    )
  }

  return config
}
