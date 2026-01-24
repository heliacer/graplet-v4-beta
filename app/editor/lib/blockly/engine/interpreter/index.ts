import { Expression, ProgramState, RunState, Value } from '../ast'
import {
  interpIf,
  interpMain,
  interpRepeat,
  interpRunseq,
  interpWait
} from './control'
import { interpChangevar, interpSetfunc, interpSetvar } from './effects'
import {
  interpAndor,
  interpArithmetic,
  interpAtan2,
  interpCompare,
  interpConstrain,
  interpHtrig,
  interpMap,
  interpModulo,
  interpNeg,
  interpRandomfloat,
  interpRandomint,
  interpRound,
  interpSingle,
  interpTrig
} from './operators'
import {
  interpRotatexyz,
  interpSetposxyz,
  interpSetroteulerxyz,
  interpSetscalexyz,
  interpTranslatexyz
} from './statements'
import { interpCall, interpLiteral, interpVar } from './values'

export async function evaluateExpression(
  expression: Expression,
  state: ProgramState
): Promise<Value | undefined> {
  switch (expression.type) {
    case 'main': {
      await interpMain(expression, state)
      break
    }
    case 'runseq': {
      await interpRunseq(expression, state)
      break
    }
    case 'if': {
      await interpIf(expression, state)
      break
    }
    case 'repeat': {
      await interpRepeat(expression, state)
      break
    }
    case 'wait': {
      await interpWait(expression, state)
      break
    }
    case 'setfunc': {
      interpSetfunc(expression, state)
      break
    }
    case 'setvar': {
      await interpSetvar(expression, state)
      break
    }
    case 'changevar': {
      await interpChangevar(expression, state)
      break
    }
    case 'literal': {
      return interpLiteral(expression)
    }
    case 'var': {
      return interpVar(expression, state)
    }
    case 'call': {
      return await interpCall(expression, state)
    }
    case 'andor': {
      return await interpAndor(expression, state)
    }
    case 'neg': {
      return await interpNeg(expression, state)
    }
    case 'compare': {
      return await interpCompare(expression, state)
    }
    case 'arithmetic': {
      return await interpArithmetic(expression, state)
    }
    case 'map': {
      return await interpMap(expression, state)
    }
    case 'trig': {
      return await interpTrig(expression, state)
    }
    case 'htrig': {
      return await interpHtrig(expression, state)
    }
    case 'round': {
      return await interpRound(expression, state)
    }
    case 'single': {
      return await interpSingle(expression, state)
    }
    case 'atan2': {
      return await interpAtan2(expression, state)
    }
    case 'modulo': {
      return await interpModulo(expression, state)
    }
    case 'constrain': {
      return await interpConstrain(expression, state)
    }
    case 'randomfloat': {
      return interpRandomfloat()
    }
    case 'randomint': {
      return await interpRandomint(expression, state)
    }
    case 'setposxyz': {
      return await interpSetposxyz(expression, state)
    }
    case 'setscalexyz': {
      return await interpSetscalexyz(expression, state)
    }
    case 'setroteulerxyz': {
      return await interpSetroteulerxyz(expression, state)
    }
    case 'rotatexyz': {
      return await interpRotatexyz(expression, state)
    }
    case 'translatexyz': {
      return await interpTranslatexyz(expression, state)
    }
    default:
      throw new Error(`Unknown expression type: "${expression.type}"`)
  }
}

export async function checkPoint(
  runState: React.RefObject<RunState>
): Promise<boolean> {
  if (runState.current.shouldStop) return false

  while (runState.current.shouldPause) {
    if (runState.current.shouldStop) return false

    if (runState.current.shouldStep) {
      runState.current.shouldStep = false
      break
    }

    await new Promise(res => requestAnimationFrame(res))
  }

  return true
}
