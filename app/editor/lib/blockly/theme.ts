import { Theme } from 'blockly'
import { colors } from './colors'

interface ITheme {
  blockStyles?: {
    [key: string]: Partial<Theme.BlockStyle>
  }
  categoryStyles?: {
    [key: string]: Theme.CategoryStyle
  }
  componentStyles?: Theme.ComponentStyle
  fontStyle?: Theme.FontStyle
  startHats?: boolean
  base?: string | Theme
  name: string
}

export const theme: ITheme = {
  name: 'graplet',
  componentStyles: {
    workspaceBackgroundColour: 'transparent',
    toolboxBackgroundColour: 'var(--color-ui-850)',
    flyoutBackgroundColour: 'var(--color-ui-850)',
    toolboxForegroundColour: 'var(--color-ui-200)',
    flyoutForegroundColour: 'var(--color-ui-200)',
    flyoutOpacity: 0.8
  },
  fontStyle: {
    family: 'Nunito, Nunito Fallback',
    weight: '600',
    size: 10
  },
  startHats: true,
  categoryStyles: {
    motion_category: {
      colour: colors.MOTION
    },
    events_category: {
      colour: colors.EVENTS
    },
    logic_category: {
      colour: colors.LOGIC
    },
    variables_category: {
      colour: colors.VARIABLES
    },
    math_category: {
      colour: colors.MATH
    },
    functions_category: {
      colour: colors.FUNCTIONS
    },
  },
  blockStyles: {
    motion_blocks: {
      colourPrimary: colors.MOTION
    },
    event_blocks: {
      colourPrimary: colors.EVENTS
    },
    logic_blocks: {
      colourPrimary: colors.LOGIC
    },
    variable_blocks: {
      colourPrimary: colors.VARIABLES
    },
    math_blocks: {
      colourPrimary: colors.MATH
    },
    function_blocks: {
      colourPrimary: colors.FUNCTIONS
    },
  }
}
