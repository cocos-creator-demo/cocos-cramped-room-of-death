import { AnimationSubStateMachine } from './AnimationSubStateMachine'
import {  DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from '../enums'

export default class DirectionSubStateMachine extends AnimationSubStateMachine {
  run() {

    const value= this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION)
    this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
  }

}