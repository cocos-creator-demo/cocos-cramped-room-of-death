import { _decorator, Component, Node } from 'cc'

const { ccclass, property } = _decorator

import { TileMapManager } from '../tile/TileMapManager'
import DataManager from '../runtime/DataManager'
import levels from '../levels'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import { createUINode } from '../utils'
import EventManager from '../runtime/EventManager'
import {
  DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM,
} from '../enums'
import { PlayerManager } from '../player/PlayerManager'
import { WoodenSkeletonManager } from '../woodenSkeleton/WoodenSkeletonManager'
import { DoorManager } from '../door/DoorManager'
import { BurstManager } from '../burst/BurstManager'
import { SpikesManager } from '../spikes/SpikesManager'


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

  async start() {
    this.initStage()
    this.initLevel()

    await Promise.all([
      // this.generateEnemies(),
      // this.generateDoor(),
      // this.generateBursts(),
      this.generateSpikes()
    ])

    await this.generatePlayer()
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


  async generatePlayer() {
    const node = createUINode()
    node.setParent(this.stage)

    const playerManager = node.addComponent(PlayerManager)
    await playerManager.init({
      x: 2,
      y: 8,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })

    DataManager.Instance.player = playerManager
  }

  async generateEnemies() {
    const node = createUINode()
    node.setParent(this.stage)

    const woodenSkeletonManager = node.addComponent(WoodenSkeletonManager)
    await woodenSkeletonManager.init({
      x: 2,
      y: 5,
      type: ENTITY_TYPE_ENUM.WOODEN_SKELETON,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })

    DataManager.Instance.enemies.push(woodenSkeletonManager)
  }

  async generateDoor() {
    const node = createUINode()
    node.setParent(this.stage)

    const doorManager = node.addComponent(DoorManager)
    await doorManager.init({
      x: 7,
      y: 8,
      type: ENTITY_TYPE_ENUM.DOOR,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })

    DataManager.Instance.door = doorManager
  }

  async generateBursts(){
    const node = createUINode()
    node.setParent(this.stage)

    const burstManager = node.addComponent(BurstManager)
    await burstManager.init({
      x: 2,
      y: 6,
      type: ENTITY_TYPE_ENUM.BURST,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })

    DataManager.Instance.bursts.push(burstManager)
  }

  async generateSpikes(){
    const node = createUINode()
    node.setParent(this.stage)

    const spikesManager = node.addComponent(SpikesManager)
    await spikesManager.init({
      x: 2,
      y: 6,
      type: ENTITY_TYPE_ENUM.SPIKES_FOUR,
      count: 0
    })

    // DataManager.Instance.bursts.push(burstManager)
  }

}

