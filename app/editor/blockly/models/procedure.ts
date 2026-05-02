import { procedures, utils, Workspace } from 'blockly'
import { ParameterModel } from './parameter'
import { ParameterType, ProcedureState } from '../../types'
import { triggerProceduresUpdate } from '@blockly/block-shareable-procedures'

export class ProcedureModel implements procedures.IProcedureModel {
  private readonly id: string
  private parameters: ParameterModel[] = []
  private returnTypes: ParameterType[] | null = null
  private enabled = true
  private shouldTriggerUpdates = true

  constructor(
    private readonly workspace: Workspace,
    id?: string
  ) {
    this.id = id ?? utils.idGenerator.genUid()
  }

  setName(): this {
    return this
  }

  insertParameter(param: ParameterModel, index: number): this {
    if (this.parameters[index]?.getId() === param.getId()) return this
    this.parameters.splice(index, 0, param)
    if (this.shouldTriggerUpdates) triggerProceduresUpdate(this.workspace)
    return this
  }

  deleteParameter(index: number): this {
    const param = this.parameters[index]
    if (!param) return this
    this.parameters.splice(index, 1)
    if (this.shouldTriggerUpdates) triggerProceduresUpdate(this.workspace)
    return this
  }

  setReturnTypes(types: string[] | null = []): this {
    this.returnTypes = (types ?? []) as ParameterType[]
    if (this.shouldTriggerUpdates) triggerProceduresUpdate(this.workspace)
    return this
  }

  setEnabled(enabled: boolean): this {
    if (enabled === this.enabled) return this
    this.enabled = enabled
    if (this.shouldTriggerUpdates) triggerProceduresUpdate(this.workspace)
    return this
  }

  startBulkUpdate() {
    this.shouldTriggerUpdates = false
  }
  endBulkUpdate() {
    this.shouldTriggerUpdates = true
    triggerProceduresUpdate(this.workspace)
  }

  getId(): string {
    return this.id
  }
  getName(): string {
    return ''
  }
  getEnabled(): boolean {
    return this.enabled
  }
  getReturnTypes(): ParameterType[] | null {
    return this.returnTypes
  }
  getParameter(index: number): ParameterModel {
    return this.parameters[index]
  }
  getParameters(): ParameterModel[] {
    return [...this.parameters]
  }
  saveState(): ProcedureState {
    return {
      name: '',
      id: this.id,
      returnTypes: this.returnTypes,
      parameters: this.parameters.map(p => p.saveState())
    }
  }

  static loadState(
    state: ProcedureState,
    workspace: Workspace
  ): ProcedureModel {
    const model = new ProcedureModel(workspace, state.id)
    model.startBulkUpdate()
    state.parameters?.forEach((p, i) =>
      model.insertParameter(ParameterModel.loadState(p), i)
    )
    model.setReturnTypes(state.returnTypes)
    model.endBulkUpdate()
    return model
  }
}
