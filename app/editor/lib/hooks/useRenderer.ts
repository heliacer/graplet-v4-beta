import { PerspectiveCamera, WebGLRenderer } from 'three'
import { useEditor } from '../../lib/EditorContext'
import { useEffect, useRef } from 'react'
import { DockviewPanelApi } from 'dockview-react'
import { ViewHelper } from 'three/examples/jsm/Addons.js'

export function useRenderer(panelApi: DockviewPanelApi) {
  const { scene, camera, canvas, orbit } = useEditor()
  const rendererRef = useRef<WebGLRenderer | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    /** @todo find better solution for camera management -> ref */
    if (!camera) return

    const renderer = new WebGLRenderer({
      canvas: canvas.current,
      antialias: true,
      alpha: true
    })

    renderer.autoClear = false

    const helper = new ViewHelper(camera, renderer.domElement)

    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer

    const resize = () => {
      const { clientWidth, clientHeight } = canvas.current
      renderer.setSize(clientWidth, clientHeight, false)
      renderer.setPixelRatio(window.devicePixelRatio)

      if (camera instanceof PerspectiveCamera) {
        camera.aspect = clientWidth / clientHeight
      } else {
        const aspect = clientWidth / clientHeight
        const zoom = camera.zoom
        const halfH = 6 / zoom
        const halfW = aspect * halfH
        camera.left = -halfW
        camera.right = halfW
        camera.top = halfH
        camera.bottom = -halfH
      }
      camera.updateProjectionMatrix()
    }
    resize()

    /** @todo renderer.setAnimationLoop !! for later */
    const loop = () => {
      /** @todo should change orbit to orbits map, and assign main camera to locked orbit when running */
      orbit.current?.update()

      renderer.clear()
      renderer.render(scene.current, camera)
      helper.render(renderer)

      rafRef.current = requestAnimationFrame(loop)
    }
    loop()

    const resizeListener = panelApi.onDidDimensionsChange(resize)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rendererRef.current = null
      renderer.dispose()
      resizeListener.dispose()
    }
  }, [canvas, scene, camera, panelApi, orbit])
}
