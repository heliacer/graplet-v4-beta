import { ObservableProcedureModel } from '@blockly/block-shareable-procedures'
import { BlockSvg, procedures } from 'blockly'

export declare class ProcedureBlock extends BlockSvg {
  model: ObservableProcedureModel
  getProcedureModel(): procedures.IProcedureModel
  doProcedureUpdate(): void
  isProcedureDef(): boolean
}

export type OldExtraState = {
  name: string
  params?: string[]
}

export interface FunctionExtraState {
  procedureId: string
  name?: string
  parameters?: {
    name: string
    id: string
  }[]
  returnTypes?: string[] | null
  createNewModel?: boolean
}
