import { BlockSvg, icons, utils } from 'blockly'

export class FunctionEditorIcon extends icons.Icon {
  constructor(sourceBlock: BlockSvg) {
    super(sourceBlock)
  }

  initView(pointerdownListener: (e: PointerEvent) => void) {
    if (this.svgRoot) return
    super.initView(pointerdownListener)

    utils.dom.createSvgElement(
      utils.Svg.CIRCLE,
      {
        class: 'my-css-class',
        r: '8',
        cx: '8',
        cy: '8'
      },
      this.svgRoot
    )
  }

  getType() {
    return new icons.IconType('function_editor_icon')
  }

  getSize() {
    return new utils.Size(16, 16)
  }

  getWeight() {
    return 10
  }

  onClick() {}

  isShownWhenCollapsed() {
    return true
  }

  updateCollapsed() {}

  dispose() {
    super.dispose()
  }
}
