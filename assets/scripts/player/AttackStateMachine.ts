import { DIRECTION_ENUM } from '../enums'
import AnimateState, { ANIMATION_SPEED } from '../base/AnimateState'
import { PlayerStateMachine } from './PlayerStateMachine'
import DirectionSubStateMachine from '../base/DirectionSubStateMachine'
import { AnimationClip } from 'cc'


const BASE_URL = 'texture/player/attack'

export default class AttackStateMachine extends DirectionSubStateMachine {
  constructor(fsm: PlayerStateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new AnimateState(fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [
      {
        frame: ANIMATION_SPEED * 4,
        func: 'onAttackShake',
        params: [DIRECTION_ENUM.TOP],
      },
    ]))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new AnimateState(fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [
      {
        frame: ANIMATION_SPEED * 4,
        func: 'onAttackShake',
        params: [DIRECTION_ENUM.LEFT],
      },
    ]))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new AnimateState(fsm, `${BASE_URL}/bottom`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [
      {
        frame: ANIMATION_SPEED * 4,
        func: 'onAttackShake',
        params: [DIRECTION_ENUM.BOTTOM],
      },
    ]))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new AnimateState(fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [
      {
        frame: ANIMATION_SPEED * 4,
        func: 'onAttackShake',
        params: [DIRECTION_ENUM.RIGHT],
      },
    ]))
  }
}