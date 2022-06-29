import { _decorator } from 'cc'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../enums'
import { EntityManager } from './EntityManager'
import EventManager from '../runtime/EventManager'
import DataManager from '../runtime/DataManager'
import { IEntity } from '../levels'

const { ccclass } = _decorator


@ccclass('EnemyManager')
export class EnemyManager extends EntityManager {
  targetX: number = 0
  targetY: number = 0

  init(params: IEntity) {
    super.init(params)

    this.targetX = this.x
    this.targetY = this.y

    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.changeToPlayerDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.changeToPlayerDirection, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDie, this)
  }

  onDestroy() {
    super.onDestroy()

    EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.changeToPlayerDirection)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.changeToPlayerDirection)
    EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDie)
  }

  update() {
    super.update()
  }

  // 面朝玩家方向
  changeToPlayerDirection(init:boolean) {
    if (this.isDie) return

    const player = DataManager.Instance.player
    if (!player) return
    const { x: playerX, y: playerY } = player
    const { x, y } = this
    const disX = Math.abs(x - playerX)
    const disY = Math.abs(y - playerY)

    if (disX === disY && !init) {
      return
    }

    if (playerX >= x && playerY <= y) {
      this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.RIGHT
    } else if (playerX <= x && playerY <= y) {
      this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.LEFT
    } else if (playerX <= x && playerY >= y) {
      this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.LEFT
    } else if (playerX >= x && playerY >= y) {
      this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.RIGHT
    }
  }

  onDie(target: EnemyManager) {
    if (target === this && this.state !== ENTITY_STATE_ENUM.DEATH) {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }
}