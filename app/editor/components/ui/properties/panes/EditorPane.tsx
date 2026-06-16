import { useEditorRefs } from '@/app/editor/context/EditorContext'
import { CheckBoxProperty } from '../PaneItem'
import { useEffect, useState } from 'react'

export function EditorPane() {
  const { controlsRef } = useEditorRefs()
  const [isLocal, setIsLocal] = useState(false)

  useEffect(() => {
    setIsLocal(controlsRef.current?.space === 'local')
  }, [setIsLocal, controlsRef])

  return (
    <>
      <CheckBoxProperty
        label='Local Transforms'
        checked={isLocal}
        onClick={checked => {
          if (checked) {
            controlsRef.current?.setSpace('local')
          } else {
            controlsRef.current?.setSpace('world')
          }
        }}
      />
    </>
  )
}
