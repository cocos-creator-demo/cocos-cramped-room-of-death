import { _decorator, Component, Sprite, UITransform } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM } from '../enums'
import { IEntity } from '../levels'
import { AnimationStateMachine } from './AnimationStateMachine'

const { ccclass } = _decorator


@ccclass('EntityManager')
export class EntityManager extends Component {
  x: number = 0
  y: number = 0
  fsm: AnimationStateMachine
  type: ENTITY_TYPE_ENUM

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
    this.fsm.setParams(PARAMS_NAME_ENUM[val], true)
  }

  get isDie() {
    return this.state === ENTITY_STATE_ENUM.DEATH || this.state === ENTITY_STATE_ENUM.DEATH_ON_AIR
  }

  init(params: IEntity) {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.state = params.state
    this.direction = params.direction
    this.type = params.type
    this.x = params.x
    this.y = params.y
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH - 1.5 * TILE_WIDTH, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }

  onDestroy() {
  }

}