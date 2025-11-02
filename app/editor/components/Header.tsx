import RunControls from './ui/RunControlMenu'
import UserDropdown from '@/app/ui/components/UserDropdown'
import NavMenu from './ui/NavMenu'

export default function EditorHeader() {
  return (
    <nav className="h-11 flex items-center justify-between px-2">
      <NavMenu />
      <RunControls />
      <div className="w-full h-full flex items-center justify-end">
        <div className="flex gap-4">
          <UserDropdown />
        </div>
      </div>
    </nav>
  )
}
