import '@/app/editor/styles/blockly.css'
import { useRef } from 'react'
import { useBlocklyWorkspace } from '../../lib/hooks/useBlocklyWorkspace'
import { initializeBlockly } from '../../lib/blockly/config'

initializeBlockly()

export default function CodePanel() {
  const containerRef = useRef<HTMLDivElement>(null!)
  useBlocklyWorkspace(containerRef)

  return <div ref={containerRef} className="w-full h-full" />
}
