import { useEditor } from '../EditorContext'
import {
  Camera,
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  GridHelper,
  Object3D,
  PerspectiveCamera
} from 'three'
import { blocklyObjectRegistry } from '../blockly/blocks'
import { ProjectData, SObject3D } from '../types'
import { applyProps, createObject } from '../utils/sobject3d'
import { serialization } from 'blockly'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

/**
 * @majortodo
 * REFACTOR into separate files, clean up, find smarter ways
 * DOCUMENT every function, and make clear what it does
 * TYPES annotate every function
 */
export function useObjectActions() {
  const {
    scene,
    currentObject,
    workspace,
    setCamera,
    setCurrentObject,
    setObjectVersion,
    orbitMap,
    canvas
  } = useEditor()

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
    console.info(
      `%c${object.name} was added to ${target.name || target.type}`,
      'color: aquamarine;'
    )

    /** Add children */
    if (props.children) {
      for (const child of props.children) {
        addObject(child, object)
      }
    }

    applyHelpers(object)

    /** If it's a top level sprite, set it as current */
    if (target === scene.current) {
      setCurrentObject(object)
      addToReg(object)
    }

    setObjectVersion((prev) => prev + 1)
    return object
  }

  /**
   * Adds Helpers for specific objects
   *
   * @todo if those objects are visible on the ExplorerPanel, modifying their visibility
   * does not update the local map for objectView. might need to globalise the booleans
   */
  function applyHelpers(object: Object3D) {
    if (object instanceof Camera) {
      const helper = new CameraHelper(object)
      helper.name = 'CameraHelper'
      if (object instanceof PerspectiveCamera && orbitMap.current.size === 0) {
        setCamera(object)
        const controls = new OrbitControls(object, canvas.current)
        orbitMap.current.set(object.id, controls)
        helper.visible = false
      }
      scene.current.add(helper)
    }
    if (object instanceof DirectionalLight) {
      const helper = new DirectionalLightHelper(object)
      helper.name = 'DirectionalLightHelper'
      scene.current.add(helper)
    }
  }

  /**
   * Adds Ambient light, Directional light and a Camera
   */
  function loadDefaultScene() {
    clearScene()
    addObject({
      type: 'PerspectiveCamera',
      name: 'Main Camera',
      position: [0, 8, 14],
      rotation: [0, 0, 0],
      far: 5000
    })
    addObject({
      name: 'Ambient Light',
      type: 'AmbientLight',
      intensity: 1
    })
    addObject({
      name: 'Directional Light',
      type: 'DirectionalLight',
      position: [0, 5, 0],
      intensity: 2
    })
    addObject({
      type: 'Mesh',
      name: 'Cube',
      geometry: {
        type: 'BoxGeometry',
        args: [1, 1, 1]
      },
      material: {
        type: 'MeshStandardMaterial'
      }
    })
  }

  function loadProjectData(data: string) {
    try {
      const project = JSON.parse(data) as ProjectData
      clearScene()

      /** @todo should be stricter at some point */
      if (project.scene) {
        const { children } = project.scene
        applyProps(scene.current, project.scene)
        if (children) {
          for (const sobject of children) {
            addObject(sobject)
          }
        }
        console.info('%cLoaded scene state: ', 'color: salmon;', project.scene)

        if (!workspace) throw Error('Missing workspace.')
        serialization.workspaces.load(project.workspace, workspace)
        console.info(
          '%cLoaded workspace state: ',
          'color: salmon;',
          project.workspace
        )
      }
    } catch (err) {
      console.error('Could not parse JSON data.', err)
    }
  }

  /** @todo should dispose of geometry & material after removing */
  function deleteObject(object: Object3D, target: Object3D = scene.current) {
    target.remove(object)
    // disposeObject(object)

    /** If it's a top level sprite, remove it */
    if (target === scene.current) {
      removeFromReg(object)

      if (object === currentObject) {
        if (object instanceof Camera) setCamera(null)
        const next = scene.current.children.at(-1)
        setCurrentObject(next || null)
      }
    }

    setObjectVersion((prev) => prev + 1)
  }

  /** @todo should clone geometry & material too, since those are shared by default */
  function duplicateObject(object: Object3D, target: Object3D = scene.current) {
    const clone = object.clone()
    // clone.traverse(...)
    target.add(clone)

    /** Apply changes, so it's visually visible */
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
      deleteObject(child)
    }
    setCurrentObject(null)
    blocklyObjectRegistry.options = []
    orbitMap.current.clear()

    /** @test initialize scene (I have my doubts if this is a good init place) */
    const gridHelper = new GridHelper()
    scene.current.add(gridHelper)
  }

  return {
    addObject,
    loadDefaultScene,
    deleteObject,
    duplicateObject,
    clearScene,
    loadProjectData
  }
}
