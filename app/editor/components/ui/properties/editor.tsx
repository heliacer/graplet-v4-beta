import { useEditor } from '@/app/editor/lib/EditorContext'
import { CheckBoxProperty } from '../PropertyInput'

export function EditorPane() {
  const { controls } = useEditor()

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
        }}
      />
    </>
  )
}
