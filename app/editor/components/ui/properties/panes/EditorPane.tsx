import { useEditorRefs } from '@/app/editor/context/EditorContext'
import { CheckBoxProperty } from '../PaneItem'
import { useEditorStore } from '@/app/editor/state'

export function EditorPane() {
  const { controlsRef } = useEditorRefs()
  const localTransform = useEditorStore(s => s.localTransform)
  const setLocalTransform = useEditorStore(s => s.setLocalTransform)

  return (
    <>
      <CheckBoxProperty
        label='Local Transforms'
        checked={localTransform}
        onClick={checked => {
          controlsRef.current?.setSpace(checked ? 'local' : 'world')
          setLocalTransform(checked)
        }}
      />
    </>
  )
}
