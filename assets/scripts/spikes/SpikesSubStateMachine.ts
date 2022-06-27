import {AnimationSubStateMachine} from '../base/AnimationSubStateMachine'
import { PARAMS_NAME_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from '../enums'

export default abstract class SpikesSubStateMachine extends AnimationSubStateMachine {
  run() {
    const { value: newCount } = this.fsm.params.get(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT)
    this.currentState = this.stateMachines.get(SPIKES_COUNT_MAP_NUMBER_ENUM[newCount as number])
  }
}
