import { utils } from "blockly"

export const toolbox: utils.toolbox.ToolboxDefinition = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Motion',
      categorystyle: 'motion_category',
      contents: [
        {
          kind: 'block',
          type: 'moveunitsxyz',
          inputs: {
            UNITS: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: .5
                }
              }
            }
          }
        },
        {
          kind: 'sep',
          gap: 32
        },
        {
          kind: 'block',
          type: 'setposxyz',
          inputs: {
            X: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 0
                }
              }
            },
            Y: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 0
                }
              }
            },
            Z: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 0
                }
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'setscalexyz',
          inputs: {
            X: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 2
                }
              }
            },
            Y: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 2
                }
              }
            },
            Z: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 2
                }
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'setroteulerxyz',
          inputs: {
            X: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 0
                }
              }
            },
            Y: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 0
                }
              }
            },
            Z: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 0
                }
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'translatexyz',
          fields: {
            AXIS: 'Z',
          },
          inputs: {
            UNITS: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: .5
                }
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'rotatexyz',
          fields: {
            AXIS: 'Y',
          },
          inputs: {
            ANGLE: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 15
                }
              }
            }
          }          
        }
      ]
    },
    {
      kind: 'category',
      name: 'Events',
      categorystyle: 'events_category',
      contents: [
        {
          kind: 'block',
          type: 'onclickrun'
        }
      ]
    },
    {
      kind: 'category',
      name: 'Control',
      categorystyle: 'control_category',
      contents: [
        {
          kind: 'block',
          type: 'repeat',
          inputs: {
            TIMES: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 10
                }
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'wait',
          inputs: {
            MS: {
              shadow: {
                type: 'input',
                fields: {
                  VALUE: '500'
                }
              }
            }
          }
        }
      ]
    },
    {
      kind: 'category',
      name: 'Variables',
      custom: 'VARIABLE',
      categorystyle: 'variables_category',
    },
    {
      kind: 'category',
      name: 'Math',
      categorystyle: 'math_category',
      contents: [
        {
          kind: 'block',
          type: 'math_arithmetic',
          inputs: {
            A: {
              shadow: {
                type: 'math_number',
              }
            },
            B: {
              shadow: {
                type: 'math_number'
              }
            }
          }
        }
      ]
    }
  ]
}