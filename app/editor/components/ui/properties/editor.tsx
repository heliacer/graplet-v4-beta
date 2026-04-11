import { useEditorRefs } from '@/app/editor/lib/context'
import { CheckBoxProperty } from '../PropertyInput'
import { useEditorStore } from '@/app/editor/lib/state'
import { Object3D } from 'three'

export function EditorPane({ object }: { object: Object3D }) {
  const { controls } = useEditorRefs()
  const invalidateObject = useEditorStore(s => s.invalidateObject)

  return (
    <>
      <CheckBoxProperty
        label='Local Transforms'
        checked={controls.current?.space === 'local'}
        action={checked => {
          if (checked) {
            controls.current?.setSpace('local')
          } else {
            controls.current?.setSpace('world')
          }
          invalidateObject(object)
        }}
      />
    </>
  )
}
