import { blockRendering } from "blockly"

export class GrapletRenderer extends blockRendering.Renderer {
  constructor() {
    super('graplet')

  }
  makeConstants_() {
    return new GrapletConstantProvider()    
  }
}

class GrapletConstantProvider extends blockRendering.ConstantProvider {
  constructor() {
    // Set up all of the constants from the base provider.
    super()

    // Override a few properties.
    /**
     * The width of the notch used for previous and next connections.
     * @type {number}
     * @override
     */
    this.NOTCH_WIDTH = 20

    /**
     * The height of the notch used for previous and next connections.
     * @type {number}
     * @override
     */
    this.NOTCH_HEIGHT = 10

    /**
     * Rounded corner radius.
     * @type {number}
     * @override
     */
    this.CORNER_RADIUS = 2

    /**
     * The height of the puzzle tab used for input and output connections.
     * @type {number}
     * @override
     */
    this.TAB_HEIGHT = 8
  }
}