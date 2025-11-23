import { Object3D } from 'three'

export default function GeometryProps({ object }: { object: Object3D }) {
  return <>GeometryProps for {object.name}</>
}
