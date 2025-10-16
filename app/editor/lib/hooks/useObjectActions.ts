import { useEditor } from '../EditorContext'
import { Mesh, Group, BoxGeometry, MeshStandardMaterial, Object3D } from 'three'
import { objectRegistry } from '../blockly/blocks'
import { ObjectProps } from '../types'

export const useObjectActions = () => {
  const {
    objects,
    scene,
    workspace,
    objectNames,
    setObjectNames,
    setCurrentObject
  } = useEditor()

  const createObject = (props?: ObjectProps) => {
    const { name, position, rotation, scale } = props || {
      name: `Sprite ${objectNames.length + 1}`
    }

    const defaultCube = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: '#ff6080' })
    )

    const group = new Group()
    group.add(defaultCube)
    defaultCube.name = 'Cube'
    group.name = name

    if (position) {
      group.position.set(...position)
    }
    if (rotation) {
      group.rotation.set(...rotation)
    }
    if (scale) {
      group.scale.set(...scale)
    }

    objects.current.set(name, group)
    scene.current.add(group)

    objectRegistry.options = [[name, name], ...objectRegistry.options]
    workspace?.refreshToolboxSelection()

    setCurrentObject(group)
    setObjectNames((prev) => [...prev, name])
  }

  const deleteObject = (object: Object3D) => {
    requestAnimationFrame(() => {
      scene.current.remove(object)
    })
    objects.current.delete(object.name)

    objectRegistry.options = objectRegistry.options.filter(
      ([label, value]) => label !== object.name || value !== object.name
    )
    workspace?.refreshToolboxSelection()

    setObjectNames((prev) => prev.filter((n) => n !== object.name))
    setCurrentObject((prev) => (prev?.id === object.id ? null : prev))
  }

  const duplicateObject = (object: Object3D) => {
    const clone = object.clone()
    const cloneName = `${object.name} Copy`
    clone.name = cloneName
    clone.position.x += 2

    objects.current.set(clone.name, clone)
    scene.current.add(clone)

    objectRegistry.options = [[cloneName, cloneName], ...objectRegistry.options]
    workspace?.refreshToolboxSelection()

    setObjectNames((prev) => [...prev, clone.name])
    setCurrentObject(clone)
  }

  return { createObject, deleteObject, duplicateObject }
}
