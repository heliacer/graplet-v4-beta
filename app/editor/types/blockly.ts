import { BlockSvg, serialization } from 'blockly'
import { ProcedureModel } from '../blockly/models/procedure'

export type ParameterType = 'String' | 'Number' | 'Boolean' | 'Object'
export type ProcedureInputType = ParameterType | 'Label'

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
  doProcedureUpdate(fillParams?: boolean): void
  saveExtraState: (doFullSerialization?: boolean) => ProcedureState
  loadExtraState: (state: { id: string }) => void
}

export declare class ParameterBlock extends BlockSvg {
  index: number
  model: ProcedureModel | null
  doProcedureUpdate(fillParams?: boolean): void
  /** may need its own state */
  saveExtraState: (doFullSerialization?: boolean) => ProcedureState
  loadExtraState: (state: { id: string; index: number }) => void
}
