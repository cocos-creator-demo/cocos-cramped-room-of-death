import { _decorator } from 'cc'
import { CONTROLLER_NUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../enums'
import EventManager from '../runtime/EventManager'
import { PlayerStateMachine } from './PlayerStateMachine'
import { EntityManager } from '../base/EntityManager'
import DataManager from '../runtime/DataManager'
import { IEntity } from '../levels'

const { ccclass } = _decorator


@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {

  targetX: number = 0
  targetY: number = 0
  fsm: PlayerStateMachine
  isMoving: boolean = false

  private readonly speed = 1 / 10

  async init(params: IEntity) {
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()

    super.init(params)

    this.targetX = this.x
    this.targetY = this.y

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDie, this)
  }

  onDestroy() {
    super.onDestroy()

    EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.inputHandle)
    EventManager.Instance.off(EVENT_ENUM.ATTACK_PLAYER, this.onDie)
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

    if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1 && this.isMoving) {
      this.isMoving = false
      this.x = this.targetX
      this.y = this.targetY
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    }
  }

  inputHandle(dir: CONTROLLER_NUM) {
    if (this.isMoving) {
      return
    }
    if ([ENTITY_STATE_ENUM.DEATH, ENTITY_STATE_ENUM.DEATH_ON_AIR, ENTITY_STATE_ENUM.ATTACK].indexOf(this.state) > -1) {
      return
    }
    const enemy = this.willAttack(dir)
    if (enemy) {
      EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP)

      this.state = ENTITY_STATE_ENUM.ATTACK

      EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, enemy)
      EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
      return
    }
    if (this.willBlock(dir)) {
      EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, dir)
      return
    }
    this.move(dir)
  }

  onDie(type: ENTITY_STATE_ENUM) {
    this.state = type
  }

  move(dir: CONTROLLER_NUM) {
    EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP)
    switch (dir) {
      case CONTROLLER_NUM.BOTTOM:
        this.targetY += 1
        this.isMoving = true
        this.showSmoke(DIRECTION_ENUM.BOTTOM)
        break
      case CONTROLLER_NUM.TOP:
        this.isMoving = true
        this.targetY -= 1
        this.showSmoke(DIRECTION_ENUM.TOP)
        break
      case CONTROLLER_NUM.RIGHT:
        this.isMoving = true
        this.targetX += 1
        this.showSmoke(DIRECTION_ENUM.RIGHT)
        break
      case CONTROLLER_NUM.LEFT:
        this.isMoving = true
        this.targetX -= 1
        this.showSmoke(DIRECTION_ENUM.BOTTOM)
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
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
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
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
        break
    }
  }

  willAttack(dir: CONTROLLER_NUM): EntityManager | null {
    const enemies = DataManager.Instance.enemies

    for (const enemy of enemies) {
      const { x: enemyX, y: enemyY, isDie } = enemy
      if (isDie) continue
      if (
        (dir === CONTROLLER_NUM.TOP && this.direction === DIRECTION_ENUM.TOP && enemyX === this.x && enemyY === this.y - 2) ||
        (dir === CONTROLLER_NUM.BOTTOM && this.direction === DIRECTION_ENUM.BOTTOM && enemyX === this.x && enemyY === this.y + 2) ||
        (dir === CONTROLLER_NUM.LEFT && this.direction === DIRECTION_ENUM.LEFT && enemyY === this.y && enemyX === this.x - 2) ||
        (dir === CONTROLLER_NUM.RIGHT && this.direction === DIRECTION_ENUM.RIGHT && enemyY === this.y && enemyX === this.x + 2)
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        return enemy
      }
    }
    return null
  }

  willBlock(dir: CONTROLLER_NUM): boolean {
    const { targetX: x, targetY: y, direction } = this
    const { tileInfo } = DataManager.Instance


    // 对应坐标上是否有障碍
    const hasObstacle = (x, y) => {
      const { door } = DataManager.Instance
      if (door) {
        const { x: doorX, y: doorY, isDie: isDoorDie } = door
        if (!isDoorDie && doorX === x && doorY === y) return true
      }

      const enemies = DataManager.Instance.enemies
      return enemies.some(enemy => {
        return !enemy.isDie && enemy.x === x && enemy.y === y
      })
    }

    const canTileTurnable = (x, y) => {
      const tile = tileInfo[x][y]
      if (!tile) return true
      if (!tile.turnable) return false
      return !hasObstacle(x, y)
    }
    const canTileMovable = (x, y) => {
      const tile = tileInfo[x][y]

      if (!tile) {
        // 是否有悬空的石头，有的话也可以走
        const bursts = DataManager.Instance.bursts
        return bursts.some(burst => {
          return !burst.isDie && burst.x === x && burst.y === y
        })

      }
      if (!tile.moveable) return false
      return !hasObstacle(x, y)
    }
    // 武器是否能够旋转
    const canWeaponTurn = (x, y, nextX, nextY) => {
      return canTileTurnable(x, nextY) && canTileTurnable(nextX, y) && canTileTurnable(nextX, nextY)
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

    // const playerTile = tileInfo[playerNextX] && tileInfo[playerNextX][playerNextY]
    // const weaponTile = tileInfo[weaponNextX] && tileInfo[weaponNextX][weaponNextY]
    if (canTileMovable(playerNextX, playerNextY) && canTileTurnable(weaponNextX, weaponNextY)) {
      // nothing
    } else {
      this.state = ENTITY_STATE_ENUM.BLOCK_FRONT
      return true
    }

    return false
  }

  showSmoke(type: DIRECTION_ENUM) {
    EventManager.Instance.emit(EVENT_ENUM.SHOW_SMOKE, this.x, this.y, type)
  }

  onAttackShake(type: DIRECTION_ENUM) {
    EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, type)
  }
}