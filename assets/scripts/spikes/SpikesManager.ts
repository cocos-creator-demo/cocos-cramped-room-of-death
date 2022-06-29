import { _decorator, Component, Sprite, UITransform } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import {
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM, EVENT_ENUM,
  PARAMS_NAME_ENUM,
  SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM,
} from '../enums'
import { ISpikes } from '../levels'
import { SpikesStateMachine } from './SpikesStateMachine'
import EventManager from '../runtime/EventManager'
import DataManager from '../runtime/DataManager'

const { ccclass } = _decorator


@ccclass('SpikesManager')
export class SpikesManager extends Component {
  x: number = 0
  y: number = 0
  fsm: SpikesStateMachine

  type: ENTITY_TYPE_ENUM
  private _count: number
  private _totalCount: number

  get count() {
    return this._count
  }

  set count(val) {
    this._count = val
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, val)
  }

  get totalCount() {
    return this._totalCount
  }

  set totalCount(val) {
    this._totalCount = val
    console.log(val)
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, val)
  }


  async init(params: ISpikes) {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.node.addComponent(SpikesStateMachine)
    await this.fsm.init()

    this.type = params.type
    this.x = params.x
    this.y = params.y
    const type = params.type

    this.totalCount = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[type]

    this.count = params.count

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop)
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH - 1.5 * TILE_WIDTH, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }

  onLoop() {
    if (this.count === this.totalCount) {
      this.count = 1
    } else {
      this.count++
    }
    this.onAttack()
  }

  backZero() {
    this.count = 0
  }

  onAttack() {
    const player = DataManager.Instance.player
    if(!player) return
    const { x: playerX, y: playerY, isDie } = player
    if(isDie) return
    if (this.x === playerX && this.y === playerY && this.count === this.totalCount) {
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    }
  }
}