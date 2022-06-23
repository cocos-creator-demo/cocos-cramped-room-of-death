import level1 from './level1'
import level2 from './level2'
import { TILE_TYPE_ENUM } from '../enums'


export interface ITile {
  src: number | null,
  type: TILE_TYPE_ENUM | null
}

export interface ILevel {
  mapInfo: Array<Array<ITile>>
}

const levels: Record<string, ILevel> = {
  level1,
  level2,
}

export default levels