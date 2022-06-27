import AnimateState  from '../base/AnimateState'
import { AnimationStateMachine } from '../base/AnimationStateMachine'
import { SPIKES_COUNT_ENUM } from '../enums'
import SpikesSubStateMachine from './SpikesSubStateMachine'

const BASE_URL = 'texture/spikes/spikesfour'

export default class SpikesFourSubStateMachine extends SpikesSubStateMachine {
  constructor(fsm: AnimationStateMachine) {
    super(fsm)

    this.stateMachines.set(SPIKES_COUNT_ENUM.ZERO, new AnimateState(fsm, `${BASE_URL}/zero`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.ONE, new AnimateState(fsm, `${BASE_URL}/one`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.TWO, new AnimateState(fsm, `${BASE_URL}/two`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.THREE, new AnimateState(fsm, `${BASE_URL}/three`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.FOUR, new AnimateState(fsm, `${BASE_URL}/four`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.FIVE, new AnimateState(fsm, `${BASE_URL}/five`))
  }
}
