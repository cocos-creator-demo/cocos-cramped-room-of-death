import { DIRECTION_ENUM } from '../enums'
import AnimateState from '../base/AnimateState'
import { PlayerStateMachine } from './PlayerStateMachine'
import DirectionSubStateMachine from '../base/DirectionSubStateMachine'


const BASE_URL = 'texture/player/blockturnleft'

export default class BlockTurnLeftStateMachine extends DirectionSubStateMachine {
  constructor(fsm: PlayerStateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new AnimateState(fsm, `${BASE_URL}/top`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new AnimateState(fsm, `${BASE_URL}/left`))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new AnimateState(fsm, `${BASE_URL}/bottom`))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new AnimateState(fsm, `${BASE_URL}/right`))
  }

}