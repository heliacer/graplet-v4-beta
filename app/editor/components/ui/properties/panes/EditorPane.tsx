import { CheckBoxProperty } from '../PaneItem'
import { useEditorStore } from '@/app/editor/state'

export function EditorPane() {
  const localTransform = useEditorStore(s => s.localTransform)
  const setLocalTransform = useEditorStore(s => s.setLocalTransform)

  return (
    <>
      <CheckBoxProperty
        label='Local Transforms'
        checked={localTransform}
        onClick={setLocalTransform}
      />
    </>
  )
}
