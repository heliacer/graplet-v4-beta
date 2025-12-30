import { EditMenu } from './menus/edit'
import { FileMenu } from './menus/file'
import { PanelMenu } from './menus/panel'

export function NavMenu() {
  return (
    <nav className='w-full h-full flex items-center gap-2'>
      <PanelMenu component='settings' title='Settings' iconType='Settings2' />
      <FileMenu />
      <EditMenu />
      <PanelMenu
        component='themeEditor'
        title='Theme Editor'
        iconType='PaintBucket'
      />
    </nav>
  )
}
