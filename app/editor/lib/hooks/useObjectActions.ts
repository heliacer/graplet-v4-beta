import { useEditor } from '../EditorContext'
import { Mesh, Group, BoxGeometry, MeshStandardMaterial } from 'three'
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

    const cube = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: '#ff6080' })
    )
    const group = new Group()
    group.add(cube)
    cube.name = 'cube'
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

    setCurrentObject(name)
    setObjectNames((prev) => [...prev, name])
  }

  const deleteObject = (name: string) => {
    const obj = objects.current.get(name)
    if (!obj) return

    requestAnimationFrame(() => {
      scene.current.remove(obj)
    })
    objects.current.delete(name)

    objectRegistry.options = objectRegistry.options.filter(
      ([label, value]) => label !== name || value !== name
    )
    workspace?.refreshToolboxSelection()

    setObjectNames((prev) => prev.filter((n) => n !== name))
    setCurrentObject((prev) => (prev === name ? '' : prev))
  }

  const duplicateObject = (name: string) => {
    const original = objects.current.get(name)
    if (!original) return

    const clone = original.clone()
    const cloneName = `${original.name} Copy`
    clone.name = cloneName
    clone.position.x += 2

    objects.current.set(clone.name, clone)
    scene.current.add(clone)

    objectRegistry.options = [[cloneName, cloneName], ...objectRegistry.options]
    workspace?.refreshToolboxSelection()

    setObjectNames((prev) => [...prev, clone.name])
    setCurrentObject(clone.name)
  }

  return { createObject, deleteObject, duplicateObject }
}
