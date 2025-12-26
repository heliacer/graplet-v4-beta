import { Object3D } from 'three'

export default function GeometryProps({ object }: { object: Object3D }) {
  return <p>GeometryProps for {object.name}</p>
}
