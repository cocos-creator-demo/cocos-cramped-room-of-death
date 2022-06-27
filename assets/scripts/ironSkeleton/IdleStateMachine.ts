import { DIRECTION_ENUM } from '../enums'
import AnimateState from '../base/AnimateState'
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine'
import { AnimationClip } from 'cc'
import DirectionSubStateMachine from '../base/DirectionSubStateMachine'


const BASE_URL = 'texture/ironskeleton/idle'

export default class IdleStateMachine extends DirectionSubStateMachine {
  constructor(fsm: IronSkeletonStateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new AnimateState(fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Loop))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new AnimateState(fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Loop))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new AnimateState(fsm, `${BASE_URL}/bottom`, AnimationClip.WrapMode.Loop))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new AnimateState(fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Loop))
  }
}