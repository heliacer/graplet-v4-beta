import { useEditor } from '../EditorContext'
import { Camera, Object3D } from 'three'
import { blocklyObjectRegistry } from '../blockly/blocks'
import { SMesh, SObject3D } from '../types'
import { applyProps, createObject } from '../utils/sobject3d'

export function useObjectActions() {
  const { scene, camera, workspace, setCurrentObject, setObjectVersion } =
    useEditor()

  /**
   * Adds an object to the blockly object registry
   *
   * E.g Use cases: Move [object v] (0.5) units [forwards v]
   *
   * @todo maybe accept child objects, to allow dependant block dropdowns
   */
  function addToReg(object: Object3D) {
    blocklyObjectRegistry.options.push([object.name, object.id.toString()])
    workspace?.refreshToolboxSelection()
  }

  /**
   * Removes an object from the blockly object registry
   */
  function removeFromReg(object: Object3D) {
    blocklyObjectRegistry.options = blocklyObjectRegistry.options.filter(
      ([, id]) => object.id.toString() !== id
    )
    workspace?.refreshToolboxSelection()
  }

  /**
   * Adds an object to a desired target and returns its reference
   *
   * @param target Object3D to add it to, scene by default
   */
  function addObject(
    props: SObject3D,
    target: Object3D = scene.current
  ): Object3D {
    const object = createObject(props)
    applyProps(object, props)
    target.add(object)
    console.log(`${object.name} added to ${target.name || target.type}`)

    /** Add children */
    if (props.children) {
      for (const child of props.children) {
        addObject(child, object)
      }
    }

    /** Apply camera if space is empty */
    if (object instanceof Camera) {
      camera.current = object
    }

    /** If it's a top level sprite, set it as current */
    if (target === scene.current) {
      setCurrentObject(object)
      addToReg(object)
    }

    setObjectVersion((prev) => prev + 1)
    return object
  }

  /**
   * Adds a new sprite to the scene
   */
  function newSprite() {
    const name = `Sprite ${scene.current.children.length + 1}`
    const cube: SMesh = {
      type: 'Mesh',
      name: 'Cube',
      geometry: {
        type: 'BoxGeometry',
        args: [1, 1, 1]
      },
      material: {
        type: 'MeshStandardMaterial',
        color: '#ffffff'
      }
    }
    addObject({
      type: 'Group',
      name,
      children: [cube]
    })
  }

  /**
   * Adds Ambient light, Directional light and a Camera
   */
  function loadDefaultScene() {
    clearScene()
    newSprite()
    addObject({
      name: 'Ambient Light',
      type: 'AmbientLight',
      intensity: 1
    })
    addObject({
      name: 'Directional Light',
      type: 'DirectionalLight',
      position: [3, 5, 2],
      intensity: 2
    })
    addObject({
      type: 'PerspectiveCamera',
      name: 'Perspective Camera',
      position: [0, 2, 5],
      rotation: [-0.4, 0, 0]
    })
  }

  function deleteObject(object: Object3D, target: Object3D = scene.current) {
    target.remove(object)

    /** If it's a top level sprite, remove it */
    if ((target = scene.current)) {
      const next = scene.current.children.at(-1)
      console.log(next)
      setCurrentObject((prev) => (prev?.id === object.id ? next || null : prev))
      removeFromReg(object)
    }

    setObjectVersion((prev) => prev + 1)
  }

  function duplicateObject(object: Object3D, target: Object3D = scene.current) {
    const clone = object.clone()
    target.add(clone)

    /** Apply changes, so it's visually visible */
    const name = `${object.name} Copy`
    clone.name = name
    clone.position.x += 2

    /** If it's a top level sprite, set it as current */
    if (target === scene.current) {
      setCurrentObject(clone)
      addToReg(clone)
    }
  }

  function clearScene() {
    for (let i = scene.current.children.length - 1; i >= 0; i--) {
      const child = scene.current.children[i]
      scene.current.remove(child)
    }
    setCurrentObject(null)
    blocklyObjectRegistry.options = []
  }

  return {
    addObject,
    loadDefaultScene,
    newSprite,
    deleteObject,
    duplicateObject,
    clearScene
  }
}
