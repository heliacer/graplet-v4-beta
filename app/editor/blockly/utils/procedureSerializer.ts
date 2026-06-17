import { serialization, Workspace } from 'blockly'
import { ProcedureState } from '../../types'
import { ProcedureModel } from '../models/procedure'

export class ProcedureSerializer implements serialization.ISerializer {
  priority = 75

  save(workspace: Workspace): ProcedureState[] | null {
    const procedures = workspace
      .getProcedureMap()
      .getProcedures() as ProcedureModel[]
    if (procedures.length < 1) return null
    return procedures.map(p => p.saveState())
  }

  load(state: ProcedureState[], workspace: Workspace): void {
    const map = workspace.getProcedureMap()
    for (const s of state) {
      const model = ProcedureModel.loadState(s, workspace)
      map.add(model)
    }
  }

  clear(workspace: Workspace): void {
    workspace.getProcedureMap().clear()
  }
}
