import { Frame, Thread } from '../../ast'
import { popValue, pushFrame } from './utils'
import { useEditorStore } from '../../../state'

export function handleNotification(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length < 1) throw Error('Invalid args for "notification"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ expression, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    stack.push({ ...frame, stage: 2 })
    pushFrame(thread, args[1])
    return
  }

  if (stage === 2) {
    const content = String(popValue(thread))
    const title = String(popValue(thread))
    if (title == '' && content == '') return
    const { notifications, setNotifications } = useEditorStore.getState()
    setNotifications([...notifications, { title, content }])
    return
  }

  throw new Error(`Invalid stage ${stage} for "notification"`)
}
