import { useEditor } from '../EditorContext'
import { Object3D } from 'three'
import { objectRegistry } from '../blockly/blocks'
import { SObject3D } from '../types'
import { addObject } from '../utils/sobject3d'

/** @todo needs better wiring up with new serializer */
export const useObjectActions = () => {
  const {
    objects,
    scene,
    workspace,
    objectNames,
    setObjectNames,
    setCurrentObject
  } = useEditor()

  /** @info wire attempt  */
  const addSprite = (props: SObject3D) => {
    const { name } = props
    const sprite = addObject(props)

    console.log('Adding sprite... ', sprite)
    objects.current.set(name, sprite)
    objectRegistry.options = [[name, name], ...objectRegistry.options]
    workspace?.refreshToolboxSelection()
    setCurrentObject(sprite)
    setObjectNames((prev) => [...prev, name])
  }

  /** @info wire attempt  */
  const newSprite = () => {
    const name = `Sprite ${objectNames.length + 1}`
    const cube: SObject3D = {
      type: 'Mesh',
      name: 'Cube',
      geometry: {
        type: 'Box',
        args: [1, 1, 1]
      },
      material: {
        type: 'Basic',
        color: '#ffffff'
      }
    }
    addSprite({
      type: 'Group',
      name,
      children: [cube]
    })
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

  return { addSprite, newSprite, deleteObject, duplicateObject }
}
