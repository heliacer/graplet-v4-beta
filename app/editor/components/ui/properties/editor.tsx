import { useEditorRefs } from '@/app/editor/context/editor'
import { CheckBoxProperty } from '../PropertyInput'
import { useEditorStore } from '@/app/editor/state'
import { Object3D } from 'three'
import { useEffect, useState } from 'react'

export function EditorPane({ object }: { object: Object3D }) {
  const { controlsRef } = useEditorRefs()
  const invalidateObject = useEditorStore(s => s.invalidateObject)
  const [isLocal, setIsLocal] = useState(false)

  useEffect(() => {
    setIsLocal(controlsRef.current?.space === 'local')
  }, [setIsLocal, controlsRef])

  return (
    <>
      <CheckBoxProperty
        label='Local Transforms'
        checked={isLocal}
        action={checked => {
          if (checked) {
            controlsRef.current?.setSpace('local')
          } else {
            controlsRef.current?.setSpace('world')
          }
          invalidateObject(object)
        }}
      />
    </>
  )
}
