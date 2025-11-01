import { useEditor } from '../EditorContext'
import { Object3D, OrthographicCamera, PerspectiveCamera } from 'three'
import { blocklyObjectRegistry } from '../blockly/blocks'
import { ProjectData, SGroup, SMesh, SObject3D } from '../types'
import { applyProps, createObject } from '../utils/sobject3d'
import { serialization } from 'blockly'
import { useEffect } from 'react'

export function useObjectActions() {
  const {
    scene,
    canvas,
    setCamera,
    workspace,
    shouldLoad,
    setShouldLoad,
    setCurrentObject,
    setObjectVersion
  } = useEditor()


  /** Project Loader */
  useEffect(() => {
    if (
      workspace &&
      shouldLoad &&
      scene.current.children.length === 0 &&
      workspace.getTopBlocks().length === 0
    ) {
      const data = localStorage.getItem('projectData')
      if (data) {
        loadProjectData(data)
      } else {
        /**
         * @todo maybe add default blocks
         * @todo add tutorial floating panel
         */
        loadDefaultScene()
        setShouldLoad(false)
      }
    }
  }, [loadDefaultScene, workspace])

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
    console.info(`${object.name} was added to ${target.name || target.type}`)

    /** Add children */
    if (props.children) {
      for (const child of props.children) {
        addObject(child, object)
      }
    }

    /** Apply camera if space is empty */
    if (object instanceof PerspectiveCamera) setCamP(object)
    if (object instanceof OrthographicCamera) setCamO(object)

    /** If it's a top level sprite, set it as current */
    if (target === scene.current) {
      setCurrentObject(object)
      addToReg(object)
    }

    setObjectVersion((prev) => prev + 1)
    return object
  }

  /**
   * Sets a PerspectiveCamera as currently active Viewport camera
   */
  function setCamP(camera: PerspectiveCamera) {
    if (!canvas.current) throw Error('No canvas')
    camera.aspect = canvas.current.width / canvas.current.height
    camera.updateProjectionMatrix()
    setCamera(camera)
  }

  /**
   * Sets an OrthographpicCamera as currently active viewport camera
   */
  function setCamO(camera: OrthographicCamera) {
    if (!canvas.current) throw Error('No canvas')
    const aspect = canvas.current.width / canvas.current.height
    const zoom = camera?.zoom || 1
    const halfH = 6 / zoom
    const halfW = aspect * halfH
    camera.left = -halfW
    camera.right = halfW
    camera.top = halfH
    camera.bottom = -halfH
    camera.updateProjectionMatrix()
    setCamera(camera)
  }

  /**
   * Adds a new sprite to the scene
   */
  function newSprite() {
    const name = `Sprite ${scene.current.children.length + 1}`
    const cube: SMesh = {
      type: 'Mesh',
      name: 'Block',
      geometry: {
        type: 'BoxGeometry',
        args: [1, 2, 1]
      },
      material: {
        type: 'MeshStandardMaterial',
        color: '#0000ff'
      }
    }
    const sphere: SMesh = {
      type: 'Mesh',
      name: 'Ball',
      geometry: {
        type: 'SphereGeometry',
        args: []
      },
      material: {
        type: 'MeshStandardMaterial',
        color: '#ff0000'
      }
    }
    const temp: SGroup = {
      type: 'Group',
      name: 'Group  ',
      children: [cube, sphere]
    }
    addObject({
      type: 'Group',
      name,
      children: [temp, temp]
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
      name: 'Cam 1',
      position: [0, 2, 5],
      rotation: [-0.4, 0, 0]
    })
    addObject({
      type: 'PerspectiveCamera',
      name: 'Cam 2',
      position: [0, 2, 8],
      rotation: [-0.4, 0, 0]
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
        console.info('Loaded scene state: ', project.scene)

        if (!workspace) throw Error('Missing workspace.')
        serialization.workspaces.load(project.workspace, workspace)
        console.info('Loaded workspace state: ', project.workspace)
      }
    } catch (err) {
      console.error('Could not parse JSON data.', err)
    }
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
    clearScene,
    loadProjectData,
    setCamO,
    setCamP
  }
}
