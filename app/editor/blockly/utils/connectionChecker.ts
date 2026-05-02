import { Connection, ConnectionChecker } from 'blockly'

export class GrapletConnectionChecker extends ConnectionChecker {
  constructor() {
    super()
  }

  doTypeChecks(a: Connection, b: Connection) {
    if (b.getSourceBlock().type === 'function_def') return false
    return super.doTypeChecks(a, b)
  }
}
