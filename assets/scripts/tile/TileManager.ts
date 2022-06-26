import { _decorator, Component, Sprite, SpriteFrame, UITransform } from 'cc'
import { TILE_TYPE_ENUM } from '../enums'

const { ccclass, property } = _decorator


export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

@ccclass('TileManager')
export class TileManager extends Component {

  type: TILE_TYPE_ENUM
  moveable: boolean
  turnable: boolean

  init(type: TILE_TYPE_ENUM, spriteFrame: SpriteFrame, i: number, j: number) {

    this.type = type
    if ([TILE_TYPE_ENUM.WALL_ROW, TILE_TYPE_ENUM.WALL_COLUMN, TILE_TYPE_ENUM.WALL_LEFT_TOP, TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM, TILE_TYPE_ENUM.WALL_LEFT_BOTTOM, TILE_TYPE_ENUM.WALL_RIGHT_TOP].indexOf(type) > -1) {
      this.moveable = false
      this.turnable = false
    } else if ([TILE_TYPE_ENUM.CLIFF_CENTER, TILE_TYPE_ENUM.CLIFF_LEFT, TILE_TYPE_ENUM.CLIFF_RIGHT].indexOf(type) > -1) {
      this.moveable = false
      this.turnable = true
    } else if (this.type === TILE_TYPE_ENUM.FLOOR) {
      this.moveable = true
      this.turnable = true
    }


    const sprite = this.addComponent(Sprite)
    sprite.spriteFrame = spriteFrame

    const uiTransform = this.getComponent(UITransform)
    uiTransform.setContentSize(TILE_WIDTH, TILE_HEIGHT)

    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)
  }
}
