import { _decorator, Sprite, UITransform } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import { CONTROLLER_NUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../enums'
import EventManager from '../runtime/EventManager'
import { PlayerStateMachine } from './PlayerStateMachine'
import { EntityManager } from '../base/EntityManager'
import DataManager from '../runtime/DataManager'

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
      x: 2,
      y: 8,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })

    this.targetX = this.x
    this.targetY = this.y

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
      case CONTROLLER_NUM.TURN_RIGHT:
        if (this.direction === DIRECTION_ENUM.TOP) {
          this.direction = DIRECTION_ENUM.RIGHT
        } else if (this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.BOTTOM
        } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
          this.direction = DIRECTION_ENUM.LEFT
        } else if (this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.TOP
        }
        this.state = ENTITY_STATE_ENUM.TURN_RIGHT
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
    const { targetX: x, targetY: y, direction } = this
    const { tileInfo } = DataManager.Instance

    // 武器是否能够旋转
    const canWeaponTurn = (x, y, nextX, nextY) => {
      const t1 = tileInfo[x][nextY]
      const t2 = tileInfo[nextX][y]
      const t3 = tileInfo[nextX][nextY]

      return ((!t1 || t1.turnable) && (!t2 || t2.turnable) && (!t3 || t3.turnable))
    }
    // 根据人物位置获取武器位置
    const getWeaponPosByPlayer = (playerNextX, playerNextY) => {
      const { direction } = this
      let weaponNextX
      let weaponNextY
      if (direction === DIRECTION_ENUM.TOP) {
        weaponNextX = playerNextX
        weaponNextY = playerNextY - 1
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        weaponNextX = playerNextX
        weaponNextY = playerNextY + 1
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        weaponNextX = playerNextX + 1
        weaponNextY = playerNextY
      } else if (direction === DIRECTION_ENUM.LEFT) {
        weaponNextX = playerNextX - 1
        weaponNextY = playerNextY
      }
      return { x: weaponNextX, y: weaponNextY }
    }


    if (dir === CONTROLLER_NUM.TURN_LEFT) {

      let nextX
      let nextY
      if (direction === DIRECTION_ENUM.TOP) {
        nextX = x - 1
        nextY = y - 1
      } else if (direction === DIRECTION_ENUM.LEFT) {
        nextX = x - 1
        nextY = y + 1
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        nextX = x + 1
        nextY = y + 1
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        nextX = x + 1
        nextY = y - 1
      }
      if (!canWeaponTurn(x, y, nextX, nextY)) {
        this.state = ENTITY_STATE_ENUM.BLOCK_TURN_LEFT
        return true
      }
      return false
    } else if (dir === CONTROLLER_NUM.TURN_RIGHT) {
      let nextX
      let nextY
      if (direction === DIRECTION_ENUM.TOP) {
        nextX = x + 1
        nextY = y - 1
      } else if (direction === DIRECTION_ENUM.LEFT) {
        nextX = x - 1
        nextY = y - 1
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        nextX = x - 1
        nextY = y + 1
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        nextX = x + 1
        nextY = y + 1
      }
      if (!canWeaponTurn(x, y, nextX, nextY)) {
        this.state = ENTITY_STATE_ENUM.BLOCK_TURN_RIGHT
        return true
      }
      return false
    }

    let playerNextX
    let playerNextY

    if (dir === CONTROLLER_NUM.TOP) {
      playerNextY = y - 1
      playerNextX = x
    } else if (dir === CONTROLLER_NUM.BOTTOM) {
      playerNextY = y + 1
      playerNextX = x
    } else if (dir === CONTROLLER_NUM.LEFT) {
      playerNextY = y
      playerNextX = x - 1
    } else if (dir === CONTROLLER_NUM.RIGHT) {
      playerNextY = y
      playerNextX = x + 1
    }

    const { x: weaponNextX, y: weaponNextY } = getWeaponPosByPlayer(playerNextX, playerNextY)

    const playerTile = tileInfo[playerNextX] && tileInfo[playerNextX][playerNextY]
    const weaponTile = tileInfo[weaponNextX] && tileInfo[weaponNextX][weaponNextY]
    if (playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)) {
      // nothing
    } else {
      this.state = ENTITY_STATE_ENUM.BLOCK_FRONT
      return true
    }

    return false
  }
}