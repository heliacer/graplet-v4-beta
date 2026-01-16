import { ObservableProcedureModel } from '@blockly/block-shareable-procedures'
import { Block, procedures } from 'blockly'

export declare class ProcedureBlock extends Block {
  model: ObservableProcedureModel
  getProcedureModel(): procedures.IProcedureModel
  doProcedureUpdate(): void
  isProcedureDef(): boolean
}
