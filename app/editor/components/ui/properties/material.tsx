import { Object3D } from 'three'

export default function MaterialProps({ object }: { object: Object3D }) {
  return <>MaterialProps for {object.name}</>
}
