import { Info, X } from 'lucide-react'
import { NotificationItemProps } from '../../lib/types'
import { ItemIcon } from '../../lib/utils/icons'
import clsx from 'clsx'
import { useEditor } from '../../lib/state'

function NotificationItem({ item }: { item: NotificationItemProps }) {
  const notifications = useEditor(s => s.notifications)
  const setNotifications = useEditor(s => s.setNotifications)

  return (
    <li className={clsx('p-1 w-100 border rounded', 'bg-ui-850 border-ui-750')}>
      <div className='flex justify-between mb-1'>
        <div className='pl-1 flex gap-1 items-center'>
          {item.iconType ? (
            <ItemIcon iconType={item.iconType} size={14} />
          ) : (
            <Info size={14} />
          )}
          <p>{item.title}</p>
        </div>
        <button
          className={clsx(
            'border rounded-md px-0.5',
            'border-ui-700',
            'hover:bg-ui-750 bg-ui-800'
          )}
          onClick={() =>
            setNotifications(notifications.filter(n => n !== item))
          }
        >
          <X size={14} />
        </button>
      </div>
      <p className='text-ui-300 px-1'>{item.content}</p>
    </li>
  )
}

export function Notifications() {
  const notifications = useEditor(s => s.notifications)

  return (
    <ul
      className={clsx(
        'flex flex-col absolute bottom-8 right-2',
        'text-sm rounded gap-1 z-20'
      )}
    >
      {notifications.map((item, key) => (
        <NotificationItem key={key} item={item} />
      ))}
    </ul>
  )
}
