import { _decorator, Component, Node } from 'cc'

const { ccclass, property } = _decorator

import { TileMapManager } from '../tile/TileMapManager'
import DataManager from '../runtime/DataManager'
import levels from '../levels'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import { createUINode } from '../utils'
import EventManager from '../runtime/EventManager'
import { EVENT_ENUM } from '../enums'
import { PlayerManager } from '../player/PlayerManager'


@ccclass('BattleManager')
export class BattleManager extends Component {
  stage: Node

  onLoad() {
    DataManager.Instance.levelIndex = 1

    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
  }

  start() {
    this.initStage()
    this.initLevel()
    this.generatePlayer()
  }

  initStage() {
    const stage = createUINode()
    stage.setParent(this.node)
    this.stage = stage
  }

  initLevel() {
    this.clearLevel()

    const { levelIndex } = DataManager.Instance
    const level = levels[`level${levelIndex}`]

    if (level) {
      DataManager.Instance.mapInfo = level.mapInfo
      DataManager.Instance.mapRowCount = level.mapInfo.length || 0
      DataManager.Instance.mapColumnCount = level.mapInfo[0]?.length || 0
    }

    this.generateTileMap()
  }

  nextLevel() {
    DataManager.Instance.levelIndex++
    this.initLevel()
  }

  clearLevel() {
    DataManager.Instance.reset()
    this.stage.destroyAllChildren()
  }

  async generatePlayer() {
    const node = createUINode()
    node.setParent(this.stage)

    const playerManager = node.addComponent(PlayerManager)
    await playerManager.init()

  }

  async generateTileMap() {
    const stage = this.stage

    const tileMap = createUINode()
    tileMap.setParent(stage)

    const tileManager = tileMap.addComponent(TileMapManager)
    await tileManager.init()

    // 适配地图的位置
    const { mapRowCount, mapColumnCount } = DataManager.Instance
    const disX = (TILE_WIDTH * mapRowCount) / 2
    const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 100

    stage.setPosition(-disX, disY)
  }

}

