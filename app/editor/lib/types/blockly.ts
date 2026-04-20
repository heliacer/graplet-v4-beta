import { ObservableProcedureModel } from '@blockly/block-shareable-procedures'
import {
  ContinuousCategory,
  ContinuousFlyout,
  ContinuousMetrics
} from '@blockly/continuous-toolbox'
import { Block, BlockSvg, Options, procedures } from 'blockly'

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

export class ContinuousIconCategory extends ContinuousCategory {
  override createIconDom_(): Element {
    const icon = document.createElement('div')
    icon.classList.add('categoryBubble')
    icon.classList.add(this.name_)
    icon.style.backgroundColor = this.colour_
    return icon
  }
}

export class CompactContinuousFlyout extends ContinuousFlyout {
  GAP_Y: number
  constructor(options: Options) {
    super(options)
    this.GAP_Y = 20
    this.autoClose = true
  }
}

export class ContinuousClosableMetrics extends ContinuousMetrics {
  override getViewMetrics(getWorkspaceCoordinates = false) {
    const metrics = super.getViewMetrics(getWorkspaceCoordinates)
    const flyoutMetrics = this.getFlyoutMetrics(false)
    const scale = getWorkspaceCoordinates ? this.workspace_.scale : 1
    metrics.width += flyoutMetrics.width / scale
    return metrics
  }

  override getAbsoluteMetrics() {
    const abs = super.getAbsoluteMetrics()
    const flyoutMetrics = this.getFlyoutMetrics(false)
    abs.left -= flyoutMetrics.width
    return abs
  }
}
