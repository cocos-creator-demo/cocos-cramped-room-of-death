import { _decorator, Sprite, UITransform } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../enums'
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine'
import { EntityManager } from '../base/EntityManager'
import EventManager from '../runtime/EventManager'
import DataManager from '../runtime/DataManager'

const { ccclass } = _decorator


@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {
  targetX: number = 0
  targetY: number = 0
  fsm: WoodenSkeletonStateMachine

  init() {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)
    this.fsm.init()

    super.init({
      x: 2,
      y: 5,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })

    this.targetX = this.x
    this.targetY = this.y

    this.render()

    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.changeToPlayerDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.changeToPlayerDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.attackPlayer, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDie, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.changeToPlayerDirection)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.changeToPlayerDirection)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.attackPlayer)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onDie)
  }

  update() {
    super.update()
  }

  render() {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)
  }

  // 面朝玩家方向
  changeToPlayerDirection() {
    if(this.state === ENTITY_STATE_ENUM.DEATH) return
    const player = DataManager.Instance.player
    if (!player) return
    const { x: playerX, y: playerY } = player
    const { x, y } = this
    const disX = Math.abs(x - playerX)
    const dixY = Math.abs(y - playerY)
    if (playerX >= x && playerY <= y) {
      this.direction = dixY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.RIGHT
    } else if (playerX <= x && playerY <= y) {
      this.direction = dixY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.LEFT
    } else if (playerX <= x && playerY >= y) {
      this.direction = dixY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.LEFT
    } else if (playerX >= x && playerY >= y) {
      this.direction = dixY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.RIGHT
    }
  }

  attackPlayer() {
    if(this.state === ENTITY_STATE_ENUM.DEATH) return

    const player = DataManager.Instance.player
    if (!player) return
    const { x: playerX, y: playerY, state: playerState } = player

    const canAttack = (this.x === playerX && Math.abs(this.y - playerY) <= 1) || (this.y === playerY && Math.abs(this.x - playerX) <= 1)
    if (canAttack && playerState !== ENTITY_STATE_ENUM.DEATH) {
      this.state = ENTITY_STATE_ENUM.ATTACK
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    } else {
      this.state = ENTITY_STATE_ENUM.IDLE
    }
  }

  onDie(target: WoodenSkeletonManager) {
    if (target === this && this.state !== ENTITY_STATE_ENUM.DEATH) {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }
}