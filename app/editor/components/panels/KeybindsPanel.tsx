export default function KeybindsPanel() {
  return (
    <div className='text-sm m-4'>
      <p className='mb-1'>Work in progress</p>
      <p>
        <code>Ctrl + S</code>
        <label className='ml-5'>Save Project</label>
      </p>
      <p>
        <code>Ctrl + /</code>
        <label className='ml-5'>Open Keybinds</label>
      </p>
      <p>
        <code>Ctrl + I</code>
        <label className='ml-5'>Open Settings</label>
      </p>
      <p>
        <code>Ctrl + Y</code>
        <label className='ml-5'>Toggle toolbox autoclose</label>
      </p>
      <br />
      <p>
        <code>Numpad 0</code>
        <label className='ml-5'>Orbit to center</label>
      </p>
      <p>
        <code>Numpad 1</code>
        <label className='ml-5'>Orbit to front view</label>
      </p>
      <p>
        <code>Numpad 2</code>
        <label className='ml-5'>Orbit to top view</label>
      </p>
      <p>
        <code>Numpad 3</code>
        <label className='ml-5'>Orbit to side view</label>
      </p>
      <br />
      <p>
        <code>T</code>
        <label className='ml-5'>Translate Tool</label>
      </p>
      <p>
        <code>R</code>
        <label className='ml-5'>Rotate Tool</label>
      </p>
      <p>
        <code>S</code>
        <label className='ml-5'>Scale Tool</label>
      </p>
      <p>
        <code>M</code>
        <label className='ml-5'>Move Tool</label>
      </p>
      <p>
        <code>P</code>
        <label className='ml-5'>Path Tool</label>
      </p>
      <br/>
      <p>
        <code>Del</code>
        <label className='ml-5'>Delete Object</label>
      </p>
      <br/>
      <p>
        <code>Shiftclick</code>
        <span className='italic ml-2'>on tab header</span>
        <label className='ml-5'>Float panel</label>
      </p>
      <p>
        <code>Escape</code>
        <span className='italic ml-2'>on active tab</span>
        <label className='ml-5'>Close panel</label>
      </p>
    </div>
  )
}
