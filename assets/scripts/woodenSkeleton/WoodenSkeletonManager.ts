import { _decorator } from 'cc'
import { ENTITY_STATE_ENUM, EVENT_ENUM } from '../enums'
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine'
import EventManager from '../runtime/EventManager'
import DataManager from '../runtime/DataManager'
import { EnemyManager } from '../base/EnemyManager'
import { IEntity } from '../levels'

const { ccclass } = _decorator


@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {
  targetX: number = 0
  targetY: number = 0
  fsm: WoodenSkeletonStateMachine

  init(params: IEntity) {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)
    this.fsm.init()


    super.init(params)

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.attackPlayer, this)
  }

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.attackPlayer)
  }

  update() {
    super.update()
  }

  attackPlayer() {
    if (this.state === ENTITY_STATE_ENUM.DEATH) return

    const player = DataManager.Instance.player
    if (!player) return
    const { x: playerX, y: playerY, state: playerState } = player

    const canAttack =
      (this.x === playerX && Math.abs(this.y - playerY) <= 1) ||
      (this.y === playerY && Math.abs(this.x - playerX) <= 1)

    if (canAttack && playerState !== ENTITY_STATE_ENUM.DEATH) {
      this.state = ENTITY_STATE_ENUM.ATTACK
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    } else {
      this.state = ENTITY_STATE_ENUM.IDLE
    }
  }
}