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
          gap: 40
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
      name: 'Logic',
      categorystyle: 'logic_category',
      contents: [
        {
          kind: 'block',
          type: 'logic_compare',
          inputs: {
            A: {
              shadow: {
                type: 'input',
              }
            },
            B: {
              shadow: {
                type: 'input'
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
          gap: 40
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
          gap: 40
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
          gap: 40
        },
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
                type: 'math_number',
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
                type: 'math_number',
              }
            },
            B: {
              shadow: {
                type: 'math_number'
              }
            }
          }
        },
        {
          kind: 'sep',
          gap: 40
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
                type: 'math_number'
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
                type: 'math_number'
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
                type: 'math_number'
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
                type: 'math_number'
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
                type: 'math_number'
              }
            },
            Y: {
              shadow: {
                type: 'math_number'
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
          gap: 40
        },
        {
          kind: 'block',
          type: 'math_number_property',
          inputs: {
            NUMBER_TO_CHECK: {
              shadow: {
                type: 'math_number'
              }
            }
          }
        },
        {
          kind: 'sep',
          gap: 40
        },
        {
          kind: 'block',
          type: 'math_modulo',
          inputs: {
            DIVIDEND: {
              shadow: {
                type: 'math_number'
              }
            },
            DIVISOR: {
              shadow: {
                type: 'math_number'
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
                type: 'math_number'
              }
            },
            LOW: {
              shadow: {
                type: 'math_number'
              }
            },
            HIGH: {
              shadow: {
                type: 'math_number'
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
                type: 'math_number'
              }
            },
            TO: {
              shadow: {
                type: 'math_number'
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
                type: 'math_number'
              }  
            },
            FROM_MIN: {
              shadow: {
                type: 'math_number'
              }  
            },
            FROM_MAX: {
              shadow: {
                type: 'math_number'
              }  
            },
            TO_MIN: {
              shadow: {
                type: 'math_number'
              }  
            },
            TO_MAX: {
              shadow: {
                type: 'math_number'
              }  
            }
          }
        },
        {
          kind: 'block',
          type: 'math_deriviative',
          inputs: {
            PROCEDURE: {
              block: {
                inline: true,
                type: 'procedures_callreturn',
                extraState: {
                  name: 'f',
                  params: ['x']
                },
                inputs: {
                  ARG0: {
                    shadow: {
                      type: 'input',
                      fields: {
                        VALUE: 0
                      }
                    }
                  }
                }
              }
            },
            NUM: {
              shadow : {
                type: 'math_number'
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'math_integral',
          inputs: {
            PROCEDURE: {
              block: {
                inline: true,
                type: 'procedures_callreturn',
                extraState: {
                  name: 'f',
                  params: ['x']
                },
                inputs: {
                  ARG0: {
                    shadow: {
                      type: 'input',
                      fields: {
                        VALUE: 0
                      }
                    }
                  }
                }
              }
            },
            FROM: {
              shadow: {
                type: 'math_number'
              }
            },
            TO: {
              shadow: {
                type: 'math_number'
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
      name: 'Functions',
      custom: 'PROCEDURE',
      categorystyle: 'procedure_category',
    }
  ]
}