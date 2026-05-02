import { useRef } from 'react'
import { initializeBlocklyConfig } from '../../blockly/init'
import { useBlocklyWorkspace } from '../../hooks/useBlocklyWorkspace'
import '../../styles/blockly.css'

initializeBlocklyConfig()

export default function CodePanel() {
  const blocklyDiv = useRef<HTMLDivElement>(null!)
  useBlocklyWorkspace(blocklyDiv)

  return <div ref={blocklyDiv} className='w-full h-full' />
}
