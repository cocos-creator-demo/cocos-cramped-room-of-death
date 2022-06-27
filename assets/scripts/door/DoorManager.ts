import { _decorator } from 'cc'
import {  ENTITY_STATE_ENUM, EVENT_ENUM } from '../enums'
import { DoorStateMachine } from './DoorStateMachine'
import { EntityManager } from '../base/EntityManager'
import EventManager from '../runtime/EventManager'
import DataManager from '../runtime/DataManager'
import { IEntity } from '../levels'


const { ccclass } = _decorator


@ccclass('DoorManager')
export class DoorManager extends EntityManager {
  targetX: number = 0
  targetY: number = 0
  fsm: DoorStateMachine

  init(params:IEntity) {
    this.fsm = this.addComponent(DoorStateMachine)
    this.fsm.init()

    super.init(params)

    this.targetX = this.x
    this.targetY = this.y

    EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onDoorOpen, this)
  }

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN, this.onDoorOpen)
  }

  onDoorOpen() {
    const enemies = DataManager.Instance.enemies
    const allDie = enemies.every(enemy => enemy.state === ENTITY_STATE_ENUM.DEATH)
    if (allDie && this.state !== ENTITY_STATE_ENUM.DEATH) {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }


}