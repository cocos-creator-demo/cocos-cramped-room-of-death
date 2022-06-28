import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from '../tile/TileMapManager'
import DataManager from '../runtime/DataManager'
import levels, { ILevel } from '../levels'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import { createUINode } from '../utils'
import EventManager from '../runtime/EventManager'
import { ENTITY_TYPE_ENUM, EVENT_ENUM } from '../enums'
import { PlayerManager } from '../player/PlayerManager'
import { WoodenSkeletonManager } from '../woodenSkeleton/WoodenSkeletonManager'
import { DoorManager } from '../door/DoorManager'
import { BurstManager } from '../burst/BurstManager'
import { SpikesManager } from '../spikes/SpikesManager'
import { IronSkeletonManager } from '../ironSkeleton/IronSkeletonManager'

const { ccclass, property } = _decorator


@ccclass('BattleManager')
export class BattleManager extends Component {
  stage: Node
  level: ILevel

  onLoad() {
    DataManager.Instance.levelIndex = 1

    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived)

  }

  async start() {
    this.initStage()
    this.initLevel()
  }

  initStage() {
    const stage = createUINode()
    stage.setParent(this.node)
    this.stage = stage
  }

  async initLevel() {
    this.clearLevel()

    const { levelIndex } = DataManager.Instance
    const level = levels[`level${levelIndex}`]

    if (!level) return
    this.level = level

    DataManager.Instance.mapInfo = level.mapInfo
    DataManager.Instance.mapRowCount = level.mapInfo.length || 0
    DataManager.Instance.mapColumnCount = level.mapInfo[0]?.length || 0

    await Promise.all([
      this.generateTileMap(),
      this.generateEnemies(),
      this.generateDoor(),
      this.generateBursts(),
      this.generateSpikes(),
    ])

    await this.generatePlayer()
  }

  nextLevel() {
    DataManager.Instance.levelIndex++
    this.initLevel()
  }

  clearLevel() {
    this.stage.destroyAllChildren()
    DataManager.Instance.reset()
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
    await playerManager.init(this.level.player)

    DataManager.Instance.player = playerManager

    EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
  }

  async generateEnemies() {
    DataManager.Instance.enemies = []
    const tasks = this.level.enemies.map(enemy => {
      const node = createUINode()
      node.setParent(this.stage)

      const Manager = enemy.type === ENTITY_TYPE_ENUM.WOODEN_SKELETON ? WoodenSkeletonManager : IronSkeletonManager
      // @ts-ignore
      const manager = node.addComponent(Manager)

      DataManager.Instance.enemies.push(manager)
      return manager.init(enemy)
    })

    await Promise.all(tasks)
  }

  async generateDoor() {
    const node = createUINode()
    node.setParent(this.stage)

    const doorManager = node.addComponent(DoorManager)
    await doorManager.init(this.level.door)

    DataManager.Instance.door = doorManager
  }

  async generateBursts() {
    const tasks = this.level.bursts.map(burst => {
      const node = createUINode()
      node.setParent(this.stage)

      const burstManager = node.addComponent(BurstManager)
      DataManager.Instance.bursts.push(burstManager)
      return burstManager.init(burst)
    })
    await Promise.all(tasks)
  }

  async generateSpikes() {
    const tasks = this.level.spikes.map(spike => {

      const node = createUINode()
      node.setParent(this.stage)

      const spikesManager = node.addComponent(SpikesManager)
      return spikesManager.init(spike)

    })
    await Promise.all(tasks)
  }

  checkArrived() {
    const { player, door } = DataManager.Instance
    if (!player || !door) return
    if (player.x === door.x && player.y === door.y && door.isDie) {
      EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
    }
  }

}

