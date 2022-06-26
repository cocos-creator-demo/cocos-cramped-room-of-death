import { _decorator, Animation } from 'cc'
import { PARAMS_NAME_ENUM } from '../enums'

import {
  AnimationStateMachine, getInitParamsNumber,
  getInitParamsTrigger,
} from '../base/AnimationStateMachine'
import IdleStateMachine from './IdleStateMachine'


const { ccclass } = _decorator


@ccclass('WoodenSkeletonStateMachine')
export class WoodenSkeletonStateMachine extends AnimationStateMachine {
  animationComponent: Animation

  init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()
  }

  initParams() {
    // 初始化各种值，当值变化时，会更新状态
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleStateMachine(this))
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      // const name = this.animationComponent.defaultClip.name
      // const whiteList = ['turn', 'block']
      // const reset = whiteList.some(v => {
      //   return name.includes(v)
      // })
      //
      // if (reset) {
      //   // todo
      // }
    })
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
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