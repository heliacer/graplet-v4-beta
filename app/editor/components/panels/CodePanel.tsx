import '@/app/editor/styles/blockly.css'
import { useRef } from 'react'
import { useBlocklyWorkspace } from '../../lib/hooks/useBlocklyWorkspace'
import { initializeBlockly } from '../../lib/blockly/config'

initializeBlockly()

export default function CodePanel() {
  const blocklyDiv = useRef<HTMLDivElement>(null!)
  useBlocklyWorkspace(blocklyDiv)

  return <div ref={blocklyDiv} className='w-full h-full' />
}
