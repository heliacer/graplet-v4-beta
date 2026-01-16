import { common } from 'blockly'

const flagIconURL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1mbGFnLWljb24gbHVjaWRlLWZsYWciPjxwYXRoIGQ9Ik00IDIyVjRhMSAxIDAgMCAxIC40LS44QTYgNiAwIDAgMSA4IDJjMyAwIDUgMiA3LjMzMyAycTIgMCAzLjA2Ny0uOEExIDEgMCAwIDEgMjAgNHYxMGExIDEgMCAwIDEtLjQuOEE2IDYgMCAwIDEgMTYgMTZjLTMgMC01LTItOC0yYTYgNiAwIDAgMC00IDEuNTI4Ii8+PC9zdmc+'

const eventBlocks = common.createBlockDefinitionsFromJsonArray([
  {
    type: 'onflagclick',
    message0: 'when %1 clicked',
    args0: [
      {
        type: 'field_image',
        src: flagIconURL,
        width: 30,
        height: 30
      }
    ],
    nextStatement: null,
    style: 'event_blocks'
  }
])

common.defineBlocks(eventBlocks)
