import { _decorator, Component, SpriteFrame } from 'cc'

const { ccclass, property } = _decorator

import { TileManager } from './TileManager'
import { createUINode } from '../utils'
import ResourceManager from '../runtime/ResourceManager'
import DataManager from '../runtime/DataManager'


@ccclass('TileMapManager')
export class TileMapManager extends Component {

  async init() {
    const frames = await ResourceManager.Instance.loadDir('texture/tile/tile', SpriteFrame)
    const { mapInfo } = DataManager.Instance

    for (let i = 0; i < mapInfo.length; ++i) {
      const column = mapInfo[i]
      for (let j = 0; j < column.length; ++j) {
        const item = column[j]
        if (item.src === null || item.type === null) continue

        const imgSrc = `tile (${item.src})`
        const spriteFrame = frames.find(v => v.name === imgSrc) || frames[0]

        const node = createUINode()
        const tileManager = node.addComponent(TileManager)
        tileManager.init(spriteFrame, i, j)

        node.setParent(this.node)
      }
    }
  }
}
