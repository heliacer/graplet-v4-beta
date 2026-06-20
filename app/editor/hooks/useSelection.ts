import { useEffect } from 'react'
import { useEditorStore } from '../state'
import { useEditorRefs } from '../context/EditorContext'
import { getObject } from '../utils/three'

export function useSelection() {
  const { objectsRef, outlinePassRef } = useEditorRefs()
  const hoveredItems = useEditorStore(s => s.hoveredItems)

  useEffect(() => {
    const outlinePass = outlinePassRef.current
    if (!outlinePass) return
    const objects = hoveredItems.map(sharedId =>
      getObject(objectsRef, sharedId)
    )
    outlinePass.selectedObjects = objects
  }, [hoveredItems, objectsRef, outlinePassRef])
}
