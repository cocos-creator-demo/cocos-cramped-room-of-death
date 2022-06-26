import Singleton from '../base/Singleton'
import { ITile } from '../levels'
import { TileManager } from '../tile/TileManager'


export default class DataManager extends Singleton {


  mapInfo: Array<Array<ITile>> = [] //关卡的描述数据
  tileInfo: Array<Array<TileManager>> = []
  mapRowCount: number
  mapColumnCount: number
  levelIndex: number = 1

  static get Instance() {
    return super.getInstance<DataManager>()
  }

  reset() {
    this.mapInfo = []
    this.mapColumnCount = 0
    this.mapRowCount = 0
    this.tileInfo = []

  }
}

