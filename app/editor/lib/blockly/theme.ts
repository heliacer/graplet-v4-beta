import { Theme } from "blockly"
import { colors } from "./colors"

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
      toolboxBackgroundColour: '#1f1f23',
      flyoutBackgroundColour: '#1f1f23',
      toolboxForegroundColour: '#e4e4e7',
      flyoutForegroundColour: '#e4e4e7',
      flyoutOpacity: 1,
      scrollbarColour: '#343437',
    },
    fontStyle: {
      family: 'Nunito, Nunito Fallback',
      weight: '600',
      size: 19
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
      variables_category : {
        colour: colors.VARIABLES
      },
      math_category : {
        colour: colors.MATH
      },
      procedure_category: {
        colour: colors.FUNCTIONS
      }
    },
    blockStyles: {
      motion_blocks : {
        colourPrimary: colors.MOTION
      },
      event_blocks: {
        colourPrimary: colors.EVENTS
      },
      logic_blocks: {
        colourPrimary: colors.LOGIC
      },
      variable_blocks : {
        colourPrimary: colors.VARIABLES
      },
      math_blocks : {
        colourPrimary: colors.MATH
      },
      procedure_blocks: {
        colourPrimary: colors.FUNCTIONS
      }
    }
  }