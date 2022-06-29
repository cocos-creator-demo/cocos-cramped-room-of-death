import { _decorator, UITransform } from 'cc'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../enums'
import { BurstStateMachine } from './BurstStateMachine'

import { EnemyManager } from '../base/EnemyManager'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import EventManager from '../runtime/EventManager'
import DataManager from '../runtime/DataManager'
import { IEntity } from '../levels'

const { ccclass } = _decorator


@ccclass('BurstManager')
export class BurstManager extends EnemyManager {
  targetX: number = 0
  targetY: number = 0
  fsm: BurstStateMachine

  init(params: IEntity) {
    this.fsm = this.addComponent(BurstStateMachine)
    this.fsm.init()
    super.init(params)
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this)
  }

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst)

  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT)
  }

  onBurst() {
    if (this.isDie || !DataManager.Instance.player) return

    const { x: playerX, y: playerY } = DataManager.Instance.player

    if (this.x === playerX && this.y === playerY && this.state === ENTITY_STATE_ENUM.IDLE) {
      this.state = ENTITY_STATE_ENUM.ATTACK
    } else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
      this.state = ENTITY_STATE_ENUM.DEATH
      EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, DIRECTION_ENUM.BOTTOM)
      if (this.x === playerX && this.y === playerY) {
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH_ON_AIR)
      }
    }

  }
}