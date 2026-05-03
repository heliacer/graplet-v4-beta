import { Connection, ConnectionChecker } from 'blockly'

export class GrapletConnectionChecker extends ConnectionChecker {
  constructor() {
    super()
  }

  doTypeChecks(a: Connection, b: Connection) {
    return super.doTypeChecks(a, b)
  }

  canConnect(
    a: Connection | null,
    b: Connection | null,
    isDragging: boolean,
    opt_distance?: number
  ) {
    if (a && b) {
      const first = a.getSourceBlock()
      const second = b.getSourceBlock()
      if (second.type === 'function_def' && first.outputConnection) return false // trying to insert a param / other output shape into the param generator
    }
    return super.canConnect(a, b, isDragging, opt_distance)
  }
}
