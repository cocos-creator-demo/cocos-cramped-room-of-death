import AnimateState from '../base/AnimateState'
import { AnimationStateMachine } from './AnimationStateMachine'

export abstract class AnimationSubStateMachine {
  stateMachines: Map<string, AnimateState> = new Map()


  private _currentState: AnimateState

  constructor(public fsm: AnimationStateMachine) {
  }

  get currentState() {
    return this._currentState
  }

  set currentState(val: AnimateState) {
    this._currentState = val
    // 切换状态时的逻辑
    this._currentState.run()
  }

  abstract run();
}