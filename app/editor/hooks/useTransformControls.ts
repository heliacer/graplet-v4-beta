import { useEffect, useRef } from 'react'
import { useEditorRefs } from '../context/EditorContext'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
import { useEditorStore } from '../state'
import { getObject } from '../utils/three'
import { Matrix4, Object3D, Vector3 } from 'three'
import { ObjectError } from '../types'

interface ObjectBinding {
  object: Object3D
  relativeMatrix: Matrix4
}

export function useTransformControls() {
  const { controlsRef, cameraRef, canvasRef, objectsRef } = useEditorRefs()
  const updateSnapshot = useEditorStore(s => s.updateSnapshot)
  const selectedItems = useEditorStore(s => s.selectedItems)
  const currentTool = useEditorStore(s => s.currentTool)
  const objectSnapping = useEditorStore(s => s.objectSnapping)

  const proxyRef = useRef<Object3D | null>(null)
  const bindingsRef = useRef<ObjectBinding[]>([])

  useEffect(() => {
    if (!cameraRef.current || !canvasRef.current) return

    const scene = getObject(objectsRef, 'scene')

    function handleDrag() {
      const proxy = proxyRef.current
      if (!proxy || bindingsRef.current.length === 0) return

      proxy.updateMatrixWorld(true)
      for (const { object, relativeMatrix } of bindingsRef.current) {
        const worldMatrix = new Matrix4().multiplyMatrices(
          proxy.matrixWorld,
          relativeMatrix
        )
        const parent = object.parent
        const localMatrix = parent
          ? new Matrix4()
              .copy(parent.matrixWorld)
              .invert()
              .multiply(worldMatrix)
          : worldMatrix

        localMatrix.decompose(object.position, object.quaternion, object.scale)
        object.updateMatrixWorld(true)
      }
    }

    function handleCommit() {
      const controls = controlsRef.current
      if (!controls) return

      const targets =
        bindingsRef.current.length > 0
          ? bindingsRef.current.map(b => b.object)
          : controls.object
            ? [controls.object]
            : []

      for (const object of targets) {
        const sharedId = object.sharedId
        if (sharedId === undefined) {
          throw new ObjectError(object, 'does not have a sharedId')
        }
        const { position, rotation, scale } = object
        updateSnapshot(sharedId, prev => ({
          ...prev,
          position: [position.x, position.y, position.z],
          rotation: [rotation.x, rotation.y, rotation.z],
          scale: [scale.x, scale.y, scale.z]
        }))
      }
    }

    /** TransformControls and pivot proxy init */
    if (!controlsRef.current) {
      const controls = new TransformControls(
        cameraRef.current,
        canvasRef.current
      )
      controls.setTranslationSnap(0.5)
      controls.setRotationSnap((45 * Math.PI) / 180)
      controls.setScaleSnap(1)
      scene.add(controls.getHelper())

      const proxy = new Object3D()
      proxy.name = 'transformProxy'
      scene.add(proxy)
      proxyRef.current = proxy

      controls.addEventListener('objectChange', handleDrag)
      controls.addEventListener('mouseUp', handleCommit)
      controlsRef.current = controls
    }

    const controls = controlsRef.current
    const proxy = proxyRef.current
    if (!proxy) return

    const isTransformTool =
      currentTool === 'translate' ||
      currentTool === 'rotate' ||
      currentTool === 'scale'

    if (!isTransformTool || selectedItems.length === 0) {
      controls.detach()
      bindingsRef.current = []
      return
    }

    controls.setMode(currentTool)
    controls.setTranslationSnap(objectSnapping.translate)
    controls.setRotationSnap((objectSnapping.rotate * Math.PI) / 180)
    controls.setScaleSnap(objectSnapping.scale)

    const objects = selectedItems.map(id => getObject(objectsRef, id))

    if (objects.length === 1) {
      bindingsRef.current = []
      controls.attach(objects[0])
    } else {
      const centroid = new Vector3()
      for (const o of objects) centroid.add(o.getWorldPosition(new Vector3()))
      centroid.divideScalar(objects.length)

      if (currentTool === 'translate' && objectSnapping.translate) {
        const snap = objectSnapping.translate
        centroid.x = Math.round(centroid.x / snap) * snap
        centroid.y = Math.round(centroid.y / snap) * snap
        centroid.z = Math.round(centroid.z / snap) * snap
      }

      proxy.position.copy(centroid)

      proxy.position.copy(centroid)
      proxy.quaternion.identity()
      proxy.scale.set(1, 1, 1)
      proxy.updateMatrixWorld(true)

      const proxyInverse = new Matrix4().copy(proxy.matrixWorld).invert()
      bindingsRef.current = objects.map(object => {
        object.updateMatrixWorld(true)
        const relativeMatrix = new Matrix4().multiplyMatrices(
          proxyInverse,
          object.matrixWorld
        )
        return { object, relativeMatrix }
      })

      controls.attach(proxy)
    }
  }, [
    cameraRef,
    canvasRef,
    controlsRef,
    currentTool,
    objectSnapping,
    updateSnapshot,
    objectsRef,
    selectedItems
  ])
}
