import { procedures, utils } from 'blockly'
import { ParameterState, ProcedureInputType } from '../../types'

export class ParameterModel implements procedures.IParameterModel {
  private readonly id: string
  private name: string
  private type: ProcedureInputType

  constructor(name: string, type: ProcedureInputType, id?: string) {
    this.id = id ?? utils.idGenerator.genUid()
    this.name = name
    this.type = type
  }

  setName(name: string): this {
    this.name = name
    return this
  }

  setTypes(types: string[]): this {
    this.type = types[0] as ProcedureInputType
    return this
  }

  /** Who invented this model? */
  setProcedureModel(): this {
    return this
  }

  getId(): string {
    return this.id
  }
  getName(): string {
    return this.name
  }
  getTypes(): ProcedureInputType[] {
    return [this.type]
  }

  saveState(): ParameterState {
    return { id: this.id, name: this.name, types: [this.type] }
  }

  static loadState(state: ParameterState): ParameterModel {
    return new ParameterModel(state.name, state.types[0], state.id)
  }
}
