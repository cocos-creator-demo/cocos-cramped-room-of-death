import { _decorator, Sprite, UITransform } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../enums'
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine'
import { EntityManager } from '../base/EntityManager'

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
      x: 7,
      y: 7,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })

    this.targetX = this.x
    this.targetY = this.y

    this.render()
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

}