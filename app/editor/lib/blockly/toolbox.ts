export const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Motion',
      categorystyle: 'motion',
      contents: [
        {
          kind: 'block',
          type: 'setposxyz'
        },
        {
          kind: 'block',
          type: 'setroteulerxyz'
        },
        {
          kind: 'block',
          type: 'translatexyz',
          fields: {
            AXIS: 'Z',
            DISTANCE: 1
          }
        },
        {
          kind: 'block',
          type: 'rotatexyz',
          fields: {
            AXIS: 'Y',
            ANGLE: 15
          }
        }
      ]
    },
    {
      kind: 'category',
      name: 'Events',
      categorystyle: 'events',
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
      categorystyle: 'control',
      contents: [
        {
          kind: 'block',
          type: 'repeat',
          fields: {
            TIMES: 10
          }
        },
        {
          kind: 'block',
          type: 'wait',
          fields: {
            MS: 1000
          }
        }
      ]
    }
  ]
}