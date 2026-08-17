import { Mesh, Points, PointsMaterial } from 'three'
import { useEditorRefs } from '../context/EditorContext'
import { getObject } from '../utils/three'
import { useEffect, useRef } from 'react'
import { useEditorStore } from '../state'

export function useVerticeTest() {
  const { objectsRef } = useEditorRefs()
  const sobject = useEditorStore(s => s.objectSnapshots['1'])
  const addPoints = useRef(true)

  /** testing cube (0) */
  useEffect(() => {
    if (sobject !== undefined && addPoints.current) {
      addPoints.current = false
      const object = getObject(objectsRef, '0') as Mesh

      const material = new PointsMaterial({
        color: 0xff0000,
        size: 0.2,
      })
      const points = new Points(object.geometry, material)
      object.add(points)
      console.log('added points wohoo')
    }
  }, [sobject])
}
