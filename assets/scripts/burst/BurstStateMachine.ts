import { _decorator, Animation } from 'cc'
import { PARAMS_NAME_ENUM } from '../enums'

import {
  AnimationStateMachine, getInitParamsNumber,
  getInitParamsTrigger,
} from '../base/AnimationStateMachine'
import AnimateState from '../base/AnimateState'


const { ccclass } = _decorator

const BASE_URL = 'texture/burst'

@ccclass('BurstStateMachine')
export class BurstStateMachine extends AnimationStateMachine {
  animationComponent: Animation

  init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    // this.initAnimationEvent()
  }

  initParams() {
    // 初始化各种值，当值变化时，会更新状态
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())

    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new AnimateState(this, `${BASE_URL}/idle`))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new AnimateState(this, `${BASE_URL}/death`))
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AnimateState(this, `${BASE_URL}/attack`))
  }

  // initAnimationEvent() {
  //   this.animationComponent.on(Animation.EventType.FINISHED, () => {
  //     const name = this.animationComponent.defaultClip.name
  //     const whiteList = ['attack']
  //     const reset = whiteList.some(v => {
  //       return name.includes(v)
  //     })
  //
  //     if (reset) {
  //       // this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
  //     }
  //   })
  // }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
        if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
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