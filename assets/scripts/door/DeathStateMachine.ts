import { DIRECTION_ENUM } from '../enums'
import AnimateState from '../base/AnimateState'
import { DoorStateMachine } from './DoorStateMachine'
import DirectionSubStateMachine from '../base/DirectionSubStateMachine'


const BASE_URL = 'texture/door/death'

export default class DeathStateMachine extends DirectionSubStateMachine {
  constructor(fsm: DoorStateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new AnimateState(fsm, `${BASE_URL}/death`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new AnimateState(fsm, `${BASE_URL}/death`))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new AnimateState(fsm, `${BASE_URL}/death`))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new AnimateState(fsm, `${BASE_URL}/death`))
  }
}