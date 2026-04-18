import { ObservableProcedureModel } from '@blockly/block-shareable-procedures'
import { Block, BlockSvg, procedures } from 'blockly'

export declare class ProcedureBlock extends BlockSvg {
  model: ObservableProcedureModel | null
  getProcedureModel(): procedures.IProcedureModel
  doProcedureUpdate(): void
  saveExtraState: (doFullSerialization?: boolean) => FunctionExtraState
  isProcedureDef(): boolean
}

export declare class ProcedureDefBlock extends ProcedureBlock {
  block: Block
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
}
