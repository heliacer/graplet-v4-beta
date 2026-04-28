import { BlockSvg, procedures, serialization } from 'blockly'
import { ProcedureModel } from '../blockly/models/procedure'

export type ParameterType = 'text' | 'number' | 'bool'
export type ProcedureInputType = ParameterType | 'label'

export interface ParameterState
  extends serialization.procedures.ParameterState {
  types: ProcedureInputType[]
}

export interface ProcedureState extends serialization.procedures.State {
  parameters: ParameterState[]
  /** Should only hold one return type, but it's an array because blockly */
  returnTypes: ParameterType[] | null
}

export declare class ProcedureBlock extends BlockSvg {
  model: ProcedureModel | null
  getProcedureModel(): procedures.IProcedureModel
  doProcedureUpdate(): void
  saveExtraState: (doFullSerialization?: boolean) => ProcedureState
  loadExtraState: (state: { id: string }) => void
  isProcedureDef(): boolean
}
