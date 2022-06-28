import level1 from './level1'
import level2 from './level2'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from '../enums'


export interface ITile {
  src: number | null,
  type: TILE_TYPE_ENUM | null
}

export interface ILevel {
  mapInfo: Array<Array<ITile>>,
  player: IEntity,
  enemies: IEntity[],
  bursts: IEntity[],
  door: IEntity,
  spikes: ISpikes[]
}

const levels: Record<string, ILevel> = {
  level1,
  level2,
}

export default levels


export interface IEntity {
  type: ENTITY_TYPE_ENUM,
  x: number,
  y: number,
  state: ENTITY_STATE_ENUM,
  direction: DIRECTION_ENUM
}

export interface ISpikes {
  type: ENTITY_TYPE_ENUM,
  x: number,
  y: number,
  count: number
}