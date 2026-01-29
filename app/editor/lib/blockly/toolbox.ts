import { utils } from 'blockly'

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
            OBJECT: {
              shadow: {
                type: 'object'
              }
            },
            UNITS: {
              shadow: {
                type: 'number',
                fields: {
                  NUM: 0.5
                }
              }
            }
          }
        },
        {
          kind: 'sep',
          gap: 25
        },
        {
          kind: 'block',
          type: 'setposxyz',
          inputs: {
            OBJECT: {
              shadow: {
                type: 'object'
              }
            },
            X: {
              shadow: {
                type: 'number',
                fields: {
                  NUM: 0
                }
              }
            },
            Y: {
              shadow: {
                type: 'number',
                fields: {
                  NUM: 0
                }
              }
            },
            Z: {
              shadow: {
                type: 'number',
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
            OBJECT: {
              shadow: {
                type: 'object'
              }
            },
            X: {
              shadow: {
                type: 'number',
                fields: {
                  NUM: 2
                }
              }
            },
            Y: {
              shadow: {
                type: 'number',
                fields: {
                  NUM: 2
                }
              }
            },
            Z: {
              shadow: {
                type: 'number',
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
            OBJECT: {
              shadow: {
                type: 'object'
              }
            },
            X: {
              shadow: {
                type: 'number',
                fields: {
                  NUM: 0
                }
              }
            },
            Y: {
              shadow: {
                type: 'number',
                fields: {
                  NUM: 0
                }
              }
            },
            Z: {
              shadow: {
                type: 'number',
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
            AXIS: 'Z'
          },
          inputs: {
            OBJECT: {
              shadow: {
                type: 'object'
              }
            },
            UNITS: {
              shadow: {
                type: 'number',
                fields: {
                  NUM: 0.5
                }
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'rotatexyz',
          fields: {
            AXIS: 'Y'
          },
          inputs: {
            OBJECT: {
              shadow: {
                type: 'object'
              }
            },
            ANGLE: {
              shadow: {
                type: 'number',
                fields: {
                  NUM: 15
                }
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'object'
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
          type: 'onflagclick'
        }
      ]
    },
    {
      kind: 'category',
      name: 'Logic',
      categorystyle: 'logic_category',
      contents: [
        {
          kind: 'block',
          type: 'logic_compare',
          inputs: {
            A: {
              shadow: {
                type: 'text'
              }
            },
            B: {
              shadow: {
                type: 'text'
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'logic_operation'
        },
        {
          kind: 'sep',
          gap: 25
        },
        {
          kind: 'block',
          type: 'logic_negate'
        },
        {
          kind: 'block',
          type: 'logic_boolean'
        },
        {
          kind: 'sep',
          gap: 25
        },
        {
          kind: 'block',
          type: 'controls_if'
        },
        {
          kind: 'block',
          type: 'controls_ifelse'
        },
        {
          kind: 'sep',
          gap: 25
        },
        {
          kind: 'block',
          type: 'repeat',
          inputs: {
            TIMES: {
              shadow: {
                type: 'number',
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
                type: 'number',
                fields: {
                  NUM: 500
                }
              }
            }
          }
        }
      ]
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
                type: 'number'
              }
            },
            B: {
              shadow: {
                type: 'number'
              }
            }
          }
        },
        {
          kind: 'sep',
          gap: 25
        },
        {
          kind: 'block',
          type: 'math_constant'
        },
        {
          kind: 'block',
          type: 'math_trig',
          inputs: {
            NUM: {
              shadow: {
                type: 'number'
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'math_htrig',
          inputs: {
            NUM: {
              shadow: {
                type: 'number'
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'math_round',
          inputs: {
            NUM: {
              shadow: {
                type: 'number'
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'math_single',
          inputs: {
            NUM: {
              shadow: {
                type: 'number'
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'math_atan2',
          inputs: {
            X: {
              shadow: {
                type: 'number'
              }
            },
            Y: {
              shadow: {
                type: 'number'
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'math_random_float'
        },
        {
          kind: 'sep',
          gap: 25
        },
        {
          kind: 'block',
          type: 'math_number_property',
          inputs: {
            NUMBER_TO_CHECK: {
              shadow: {
                type: 'number'
              }
            }
          }
        },
        {
          kind: 'sep',
          gap: 25
        },
        {
          kind: 'block',
          type: 'math_modulo',
          inputs: {
            DIVIDEND: {
              shadow: {
                type: 'number'
              }
            },
            DIVISOR: {
              shadow: {
                type: 'number'
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'math_constrain',
          inputs: {
            VALUE: {
              shadow: {
                type: 'number'
              }
            },
            LOW: {
              shadow: {
                type: 'number'
              }
            },
            HIGH: {
              shadow: {
                type: 'number'
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'math_random_int',
          inputs: {
            FROM: {
              shadow: {
                type: 'number'
              }
            },
            TO: {
              shadow: {
                type: 'number'
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'math_map',
          inputs: {
            NUM: {
              shadow: {
                type: 'number'
              }
            },
            FROM_MIN: {
              shadow: {
                type: 'number'
              }
            },
            FROM_MAX: {
              shadow: {
                type: 'number'
              }
            },
            TO_MIN: {
              shadow: {
                type: 'number'
              }
            },
            TO_MAX: {
              shadow: {
                type: 'number'
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
      categorystyle: 'variables_category'
    },
    /*     {
      kind: 'category',
      name: 'Deprecated',
      custom: 'PROCEDURE',
      categorystyle: 'functions_category'
    }, */
    {
      kind: 'category',
      name: 'Functions',
      custom: 'FUNCTIONS',
      categorystyle: 'functions_category'
    }
  ]
}
