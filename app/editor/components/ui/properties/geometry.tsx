import { Object3D } from 'three'

export function GeometryPane({ object }: { object: Object3D }) {
  return <p>GeometryPane for {object.name}</p>
}
