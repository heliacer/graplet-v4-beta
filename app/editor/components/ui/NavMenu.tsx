import { EditMenu } from './menus/edit'
import { FileMenu } from './menus/file'
import { SettingsMenu } from './menus/settings'

export default function NavMenu() {
  return (
    <nav className='w-full h-full flex items-center gap-2'>
      <SettingsMenu />
      <FileMenu />
      <EditMenu/>
    </nav>
  )
}
