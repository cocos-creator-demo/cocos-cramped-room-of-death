import Singleton from '../base/Singleton'
import { ITile } from '../levels'
import { TileManager } from '../tile/TileManager'
import { PlayerManager } from '../player/PlayerManager'
import { DoorManager } from '../door/DoorManager'
import { EnemyManager } from '../base/EnemyManager'
import { BurstManager } from '../burst/BurstManager'


export default class DataManager extends Singleton {


  mapInfo: Array<Array<ITile>> = [] //关卡的描述数据
  tileInfo: Array<Array<TileManager>> = []
  mapRowCount: number
  mapColumnCount: number
  levelIndex: number = 1

  player: PlayerManager = null
  door: DoorManager = null
  enemies: EnemyManager[] = []
  bursts: BurstManager[] = []

  static get Instance() {
    return super.getInstance<DataManager>()
  }

  reset() {
    this.mapInfo = []
    this.mapColumnCount = 0
    this.mapRowCount = 0
    this.tileInfo = []
    this.player = null
    this.enemies = []
    this.door = null
    this.bursts = []
  }
}

