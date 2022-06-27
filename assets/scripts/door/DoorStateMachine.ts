import { _decorator, Animation } from 'cc'
import { PARAMS_NAME_ENUM } from '../enums'

import {
  AnimationStateMachine, getInitParamsNumber,
  getInitParamsTrigger,
} from '../base/AnimationStateMachine'
import IdleStateMachine from './IdleStateMachine'
import DeathStateMachine from './DeathStateMachine'

const { ccclass } = _decorator


@ccclass('DoorStateMachine')
export class DoorStateMachine extends AnimationStateMachine {
  animationComponent: Animation

  init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
  }

  initParams() {
    // 初始化各种值，当值变化时，会更新状态
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())

    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathStateMachine(this))
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
        if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        } else {
          // 触发set，执行state run
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        break
    }
  }
}