import { zelos } from 'blockly'

export class GrapletRenderer extends zelos.Renderer {
  constructor() {
    super('graplet')
  }

  makeConstants_() {
    return new GrapletConstantProvider()
  }
}

class GrapletConstantProvider extends zelos.ConstantProvider {
  constructor() {
    super()
    this.GRID_UNIT = 2

    this.SHAPE_IN_SHAPE_PADDING = {
      1: {
        // Outer shape: hexagon.
        0: 8 * this.GRID_UNIT, // Field in hexagon.
        1: 2 * this.GRID_UNIT, // Hexagon in hexagon.
        2: 1 * this.GRID_UNIT, // Round in hexagon.
        3: 2 * this.GRID_UNIT // Square in hexagon.
      },
      2: {
        // Outer shape: round.
        0: 3 * this.GRID_UNIT, // Field in round.
        1: 3 * this.GRID_UNIT, // Hexagon in round.
        2: 1 * this.GRID_UNIT, // Round in round.
        3: 2 * this.GRID_UNIT // Square in round.
      },
      3: {
        // Outer shape: square.
        0: 2 * this.GRID_UNIT, // Field in square.
        1: 2 * this.GRID_UNIT, // Hexagon in square.
        2: 2 * this.GRID_UNIT, // Round in square.
        3: 2 * this.GRID_UNIT // Square in square.
      }
    }

    this.SMALL_PADDING = 1 * this.GRID_UNIT
    this.MEDIUM_PADDING = 2 * this.GRID_UNIT
    this.MEDIUM_LARGE_PADDING = 3 * this.GRID_UNIT
    this.LARGE_PADDING = 4 * this.GRID_UNIT

    this.CORNER_RADIUS = 1.5 * this.GRID_UNIT

    this.NOTCH_WIDTH = 10 * this.GRID_UNIT
    this.NOTCH_HEIGHT = 2 * this.GRID_UNIT
    this.NOTCH_OFFSET_LEFT = 3 * this.GRID_UNIT

    this.STATEMENT_INPUT_NOTCH_OFFSET = this.NOTCH_OFFSET_LEFT

    this.MIN_BLOCK_WIDTH = 2 * this.GRID_UNIT
    this.MIN_BLOCK_HEIGHT = 12 * this.GRID_UNIT

    this.EMPTY_STATEMENT_INPUT_HEIGHT = 8 * this.GRID_UNIT

    this.TOP_ROW_MIN_HEIGHT = 2
    this.BOTTOM_ROW_MIN_HEIGHT = 2

    this.TOP_ROW_PRECEDES_STATEMENT_MIN_HEIGHT = this.LARGE_PADDING

    this.BOTTOM_ROW_AFTER_STATEMENT_MIN_HEIGHT = 6 * this.GRID_UNIT

    this.STATEMENT_BOTTOM_SPACER = -this.NOTCH_HEIGHT
    /* Minimum statement input spacer width. */
    this.STATEMENT_INPUT_SPACER_MIN_WIDTH = 40 * this.GRID_UNIT
    this.STATEMENT_INPUT_PADDING_LEFT = 4 * this.GRID_UNIT

    this.EMPTY_INLINE_INPUT_PADDING = 6 * this.GRID_UNIT
    this.EMPTY_INLINE_INPUT_HEIGHT = 12 * this.GRID_UNIT

    this.DUMMY_INPUT_MIN_HEIGHT = 6 * this.GRID_UNIT
    this.DUMMY_INPUT_SHADOW_MIN_HEIGHT = 10 * this.GRID_UNIT

    this.CURSOR_WS_WIDTH = 20 * this.GRID_UNIT
    this.FIELD_TEXT_FONTSIZE = 3 * this.GRID_UNIT

    this.FIELD_BORDER_RECT_RADIUS = this.CORNER_RADIUS
    this.FIELD_BORDER_RECT_X_PADDING = 2 * this.GRID_UNIT
    this.FIELD_BORDER_RECT_Y_PADDING = 0.5 * this.GRID_UNIT
    this.FIELD_BORDER_RECT_HEIGHT = 8 * this.GRID_UNIT

    this.FIELD_DROPDOWN_BORDER_RECT_HEIGHT = 8 * this.GRID_UNIT
    this.FIELD_DROPDOWN_SVG_ARROW_PADDING = this.FIELD_BORDER_RECT_X_PADDING
    this.FIELD_COLOUR_DEFAULT_WIDTH = 2 * this.GRID_UNIT
    this.FIELD_COLOUR_DEFAULT_HEIGHT = 4 * this.GRID_UNIT
    this.FIELD_CHECKBOX_X_OFFSET = 1 * this.GRID_UNIT
    /* The maximum width of a dynamic connection shape. */
    this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH = 12 * this.GRID_UNIT
  }
}
