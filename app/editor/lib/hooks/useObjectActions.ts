import { useEditor } from '../EditorContext'
import { Mesh, BoxGeometry, MeshStandardMaterial } from 'three'
import { objectRegistry } from '../blockly/blocks'

export const useObjectActions = () => {
  const {
    objects,
    scene,
    workspace,
    objectNames,
    setObjectNames,
    setCurrentObject
  } = useEditor()

  const createObject = () => {
    const cube = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: '#ff6080' })
    )
    const name = `Cube ${objectNames.length + 1}`
    cube.name = name

    objects.current.set(cube.name, cube)
    scene.current.add(cube)

    objectRegistry.options = [...objectRegistry.options, [name, name]]
    workspace?.refreshToolboxSelection()

    setCurrentObject(cube.name)
    setObjectNames((prev) => [...prev, cube.name])
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

    objectRegistry.options = [...objectRegistry.options, [cloneName, cloneName]]
    workspace?.refreshToolboxSelection()

    setObjectNames((prev) => [...prev, clone.name])
    setCurrentObject(clone.name)
  }

  return { createObject, deleteObject, duplicateObject }
}
