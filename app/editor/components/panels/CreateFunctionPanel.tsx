import clsx from 'clsx'

export default function CreateFunctionPanel() {
  return (
    <div className='flex items-start flex-col gap-2 m-4 text-sm'>
      <button
        className={clsx(
          'flex gap-1 px-1 items-center',
          'border rounded-md',
          'border-ui-700',
          'hover:bg-ui-750 bg-ui-800'
        )}
      >
        Create function
      </button>
    </div>
  )
}
