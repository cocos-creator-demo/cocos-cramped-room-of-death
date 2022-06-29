import { _decorator, Component, Node, director } from 'cc'
import { TileMapManager } from '../tile/TileMapManager'
import DataManager, { IRecord } from '../runtime/DataManager'
import levels, { IEntity, ILevel, ISpikes } from '../levels'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import { createUINode } from '../utils'
import EventManager from '../runtime/EventManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, SCENE_ENUM } from '../enums'
import { PlayerManager } from '../player/PlayerManager'
import { WoodenSkeletonManager } from '../woodenSkeleton/WoodenSkeletonManager'
import { DoorManager } from '../door/DoorManager'
import { BurstManager } from '../burst/BurstManager'
import { SpikesManager } from '../spikes/SpikesManager'
import { IronSkeletonManager } from '../ironSkeleton/IronSkeletonManager'
import { SmokeManager } from '../smoke/SmokeManager'
import FaderManager from '../runtime/FaderManager'
import { ShakeManager } from '../ui/ShakeManager'

const { ccclass } = _decorator


@ccclass('BattleManager')
export class BattleManager extends Component {
  private stage: Node
  private smokeLayer: Node = null
  private level: ILevel
  private hasInited: boolean = false


  onLoad() {
    DataManager.Instance.levelIndex = 1

    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this)
    EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this)
    EventManager.Instance.on(EVENT_ENUM.RECORD_STEP, this.record, this)
    EventManager.Instance.on(EVENT_ENUM.REVOKE_STEP, this.revoke, this)
    EventManager.Instance.on(EVENT_ENUM.RESTART, this.restart, this)
    EventManager.Instance.on(EVENT_ENUM.QUIT, this.quit, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived)
    EventManager.Instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke)
    EventManager.Instance.off(EVENT_ENUM.RECORD_STEP, this.record)
    EventManager.Instance.off(EVENT_ENUM.REVOKE_STEP, this.revoke)
    EventManager.Instance.off(EVENT_ENUM.REVOKE_STEP, this.revoke)
    EventManager.Instance.off(EVENT_ENUM.RESTART, this.restart)
    EventManager.Instance.off(EVENT_ENUM.QUIT, this.quit)
  }

  async start() {
    this.initStage()
    this.initLevel()
  }

  initStage() {
    const stage = createUINode()
    stage.setParent(this.node)

    stage.addComponent(ShakeManager)
    this.stage = stage
  }

  async initLevel() {
    this.clearLevel()

    const { levelIndex } = DataManager.Instance
    const level = levels[`level${levelIndex}`]

    if (!level) return
    if (this.hasInited) {
      await FaderManager.Instance.fadeIn()
    } else {
      await FaderManager.Instance.mask()
    }

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
      this.generateSmokeLayer(),
    ])

    await this.generatePlayer()
    await FaderManager.Instance.fadeOut()

    this.hasInited = true
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


    stage.getComponent(ShakeManager).stop()
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

      DataManager.Instance.spikes.push(spikesManager)

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

  async generateSmokeLayer() {
    this.smokeLayer = createUINode()
    this.smokeLayer.setParent(this.stage)
  }

  async generateSmoke(x: number, y: number, direction: DIRECTION_ENUM) {
    const item = DataManager.Instance.smokes.find((smoke: SmokeManager) => smoke.isDie)
    if (item) {
      item.x = x
      item.y = y
      item.node.setPosition(item.x * TILE_WIDTH - TILE_WIDTH * 1.5, -item.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)

      item.direction = direction
      item.state = ENTITY_STATE_ENUM.IDLE
    } else {
      const node = createUINode()
      node.setParent(this.smokeLayer)
      const smokeManager = node.addComponent(SmokeManager)
      await smokeManager.init({
        x,
        y,
        direction,
        state: ENTITY_STATE_ENUM.IDLE,
        type: ENTITY_TYPE_ENUM.SMOKE,
      })
      DataManager.Instance.smokes.push(smokeManager)
    }
  }

  record() {
    const { player, door, enemies, bursts, spikes } = DataManager.Instance
    const createEntityRecord = (i: IEntity) => {
      return {
        x: i.x,
        y: i.y,
        type: i.type,
        direction: i.direction,
        state: i.state,
      }
    }
    const item: IRecord = {
      player: createEntityRecord(player),
      door: createEntityRecord(door),
      enemies: enemies.map(createEntityRecord),
      bursts: bursts.map(createEntityRecord),
      spikes: spikes.map(({ x, y, type, count, totalCount }) => {
        return { x, y, type, count, totalCount }
      }),
    }
    // 特殊处理
    item.player.state = DataManager.Instance.player.state === ENTITY_STATE_ENUM.IDLE || DataManager.Instance.player.state === ENTITY_STATE_ENUM.DEATH || DataManager.Instance.player.state === ENTITY_STATE_ENUM.DEATH_ON_AIR ? DataManager.Instance.player.state : ENTITY_STATE_ENUM.IDLE

    DataManager.Instance.records.push(item)
  }

  revoke() {
    const data = DataManager.Instance.records.pop()
    if (!data) return
    const resetEntity = (instance, params: IEntity) => {
      instance.x = instance.targetX = params.x
      instance.y = instance.targetY = params.y
      instance.state = params.state
      instance.direction = params.direction
    }
    const resetSpike = (instance, params: ISpikes) => {
      instance.x = params.x
      instance.y = params.y
      instance.count = params.count
    }

    resetEntity(DataManager.Instance.player, data.player)
    resetEntity(DataManager.Instance.door, data.door)

    data.enemies.forEach((enemy, i) => {
      resetEntity(DataManager.Instance.enemies[i], enemy)
    })
    data.spikes.forEach((spike, i) => {
      resetSpike(DataManager.Instance.spikes[i], spike)
    })

    data.bursts.forEach((enemy, i) => {
      resetEntity(DataManager.Instance.bursts[i], enemy)
    })
  }

  restart() {
    this.initLevel()
  }

  async quit() {
    await FaderManager.Instance.fadeIn()
    director.loadScene(SCENE_ENUM.START)
  }
}

