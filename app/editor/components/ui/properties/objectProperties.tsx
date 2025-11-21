import { Object3D } from "three"
import { TextProperty } from "../PropertyInput"


function BaseObjectProps({ object }: { object: Object3D }) {
  return (
    <TextProperty
      label='Object Name'
      object={object}
      property='name'
    />
  )
}

export default function ObjectProps({ object }: { object: Object3D }) {
  switch (object.type) {
    case 'Group':
      return (
        <BaseObjectProps object={object} />
      )
    case 'Mesh':
      return (
        <BaseObjectProps object={object} />
      )
    case 'DirectionalLight':
      return (
        <BaseObjectProps object={object} />
      )
    case 'AmbientLight':
      return (
        <BaseObjectProps object={object} />
      )
    case 'PerspectiveCamera':
      return (
        <BaseObjectProps object={object} />
      )
    case 'OrthographicCamera':
      return (
        <BaseObjectProps object={object} />
      )
    default: return
  }
}
