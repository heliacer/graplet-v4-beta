import { useShortcuts } from '../../hooks/useShortcuts'

export function Footer() {
  useShortcuts()

  return (
    <footer className='h-6 flex items-center'>
      <p>Footer</p>
    </footer>
  )
}
