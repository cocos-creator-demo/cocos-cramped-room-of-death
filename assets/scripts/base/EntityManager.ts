import { _decorator, Component } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import {
  DIRECTION_ENUM,
  DIRECTION_ORDER_ENUM,
  ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM,
  PARAMS_NAME_ENUM,
} from '../enums'
import { PlayerStateMachine } from '../player/PlayerStateMachine'
import { IEntity } from '../levels'

const { ccclass } = _decorator


@ccclass('EntityManager')
export class EntityManager extends Component {
  x: number = 0
  y: number = 0
  fsm: PlayerStateMachine

  private type: ENTITY_TYPE_ENUM
  private _direction: DIRECTION_ENUM
  private _state: ENTITY_STATE_ENUM

  get direction() {
    return this._direction
  }

  set direction(val) {
    this._direction = val
    this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction])
  }

  get state() {
    return this._state
  }

  set state(val) {
    this._state = val
    this.fsm.setParams(PARAMS_NAME_ENUM.TURN_LEFT, true)
  }

  init(params: IEntity) {
    this.state = params.state
    this.direction = params.direction
    this.type = params.type
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH - 1.5 * TILE_WIDTH, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }
}