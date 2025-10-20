import {
  bumpObjects,
  common,
  DropDownDiv,
  Tooltip,
  WidgetDiv,
  WorkspaceSvg
} from 'blockly'
import { SGeometry, SObject3D, SMaterial } from './types'
import { BoxGeometry, BufferGeometry, Group, Material, Mesh, MeshStandardMaterial, Object3D } from 'three'

export function resize(workspace: WorkspaceSvg) {
  Tooltip.hide()
  workspace.hideComponents(true)
  DropDownDiv.repositionForWindowResize()
  WidgetDiv.repositionForWindowResize()
  common.svgResize(workspace)
  bumpObjects.bumpTopObjectsIntoBounds(workspace)
}

export function createGeometry(geometry: SGeometry): BufferGeometry {
  return new BoxGeometry(...geometry.args)
}

export function createMaterial(material: SMaterial): Material {
  const { color } = material
  return new MeshStandardMaterial({ color })
}

export function createObject(props: SObject3D) {
  const { type, geometry, material } = props
  switch (type) {
    case 'Mesh': {
      return new Mesh(
        createGeometry(geometry),
        createMaterial(material)
      )
    }
    case 'Group': {
      return new Group()
    }
  }
}

/**
 * @todo
 */
export function updateObject(props: Omit<SObject3D, 'geometry' | 'type'>, dest: Object3D) {
  console.log(props, dest)
}