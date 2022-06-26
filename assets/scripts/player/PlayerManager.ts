import { _decorator, Sprite, UITransform } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import {
  CONTROLLER_NUM,
  DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
} from '../enums'
import EventManager from '../runtime/EventManager'
import { PlayerStateMachine } from './PlayerStateMachine'
import { EntityManager } from '../base/EntityManager'

const { ccclass } = _decorator


@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {

  targetX: number = 0
  targetY: number = 0
  fsm: PlayerStateMachine

  private readonly speed = 1 / 10

  init() {
    this.fsm = this.addComponent(PlayerStateMachine)
    this.fsm.init()

    super.init({
      x: 0,
      y: 0,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })

    this.render()
    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)
  }

  update() {
    this.updateXY()
    super.update()
  }

  updateXY() {
    if (this.targetX < this.x) {
      this.x -= this.speed
    } else if (this.targetX > this.x) {

      this.x += this.speed
    }
    if (this.targetY < this.y) {
      this.y -= this.speed

    } else if (this.targetY > this.y) {
      this.y += this.speed
    }

    if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1) {
      this.x = this.targetX
      this.y = this.targetY
    }
  }

  inputHandle(dir: CONTROLLER_NUM) {
    if (this.willBlock(dir)) {
      return
    }
    this.move(dir)
  }

  move(dir: CONTROLLER_NUM) {
    switch (dir) {
      case CONTROLLER_NUM.BOTTOM:
        this.targetY += 1
        break
      case CONTROLLER_NUM.TOP:
        this.targetY -= 1
        break
      case CONTROLLER_NUM.RIGHT:
        this.targetX += 1
        break
      case CONTROLLER_NUM.LEFT:
        this.targetX -= 1
        break
      case CONTROLLER_NUM.TURN_LEFT:
        if (this.direction === DIRECTION_ENUM.TOP) {
          this.direction = DIRECTION_ENUM.LEFT
        } else if (this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.BOTTOM
        } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
          this.direction = DIRECTION_ENUM.RIGHT
        } else if (this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.TOP
        }
        this.state = ENTITY_STATE_ENUM.TURN_LEFT
        break
    }
  }

  render() {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)
  }

  willBlock(dir: CONTROLLER_NUM): boolean {
    return false
  }
}