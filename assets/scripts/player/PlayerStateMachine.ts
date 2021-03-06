import { _decorator, Animation } from 'cc'
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../enums'

import {
  AnimationStateMachine,
  getInitParamsTrigger,
  getInitParamsNumber,
} from '../base/AnimationStateMachine'
import IdleStateMachine from './IdleStateMachine'
import TurnLeftStateMachine from './TurnLeftStateMachine'
import TurnRightStateMachine from './TurnRightStateMachine'
import BlockFrontStateMachine from './BlockFrontStateMachine'
import { EntityManager } from '../base/EntityManager'
import BlockTurnLeftStateMachine from './BlockTurnLeftStateMachine'
import BlockTurnRightStateMachine from './BlockTurnRightStateMachine'
import DeathStateMachine from './DeathStateMachine'
import AttackStateMachine from './AttackStateMachine'
import DeathOnAirStateMachine from './DeathOnAirStateMachine'

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
    this.params.set(PARAMS_NAME_ENUM.TURN_RIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_FRONT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH_ON_AIR, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())

    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())

  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURN_LEFT, new TurnLeftStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURN_RIGHT, new TurnRightStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_FRONT, new BlockFrontStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT, new BlockTurnLeftStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT, new BlockTurnRightStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH_ON_AIR, new DeathOnAirStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AttackStateMachine(this))
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whiteList = ['turn', 'block', 'attack']
      const reset = whiteList.some(v => {
        return name.includes(v)
      })

      if (reset) {
        this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
      }
    })
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURN_RIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_FRONT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH_ON_AIR):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
        if (this.params.get(PARAMS_NAME_ENUM.TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.TURN_RIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURN_RIGHT)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_FRONT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_FRONT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT)
        } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        } else if (this.params.get(PARAMS_NAME_ENUM.DEATH_ON_AIR).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH_ON_AIR)
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