import { _decorator, Animation, AnimationClip } from 'cc'
import { PARAMS_NAME_ENUM } from '../enums'
import AnimateState from '../base/AnimateState'
import {
  AnimationStateMachine,
  getInitParamsTrigger,
  getInitParamsNumber,
} from '../base/AnimationStateMachine'
import IdleStateMachine from './IdleStateMachine'
import TurnLeftStateMachine from './TurnLeftStateMachine'

const { ccclass } = _decorator


@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends AnimationStateMachine {
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
    this.params.set(PARAMS_NAME_ENUM.TURN_LEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())

  }

  initStateMachines() {
    // 初始化各种状态，每种状态只需定义一次
    // this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new AnimateState(this, 'texture/player/idle/top', AnimationClip.WrapMode.Loop))
    // this.stateMachines.set(PARAMS_NAME_ENUM.TURN_LEFT, new AnimateState(this, 'texture/player/turnleft/top'))

    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURN_LEFT, new TurnLeftStateMachine(this))
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whiteList = ['turn']
      const reset = whiteList.some(v => {
        return name.includes(v)
      })

      if (reset) {
        this.setParams(PARAMS_NAME_ENUM.IDLE, true)
      }
    })
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(PARAMS_NAME_ENUM.TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
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