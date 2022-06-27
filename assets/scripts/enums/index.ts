/***
 * 地图瓦片枚举
 */
export enum TILE_TYPE_ENUM {
  WALL_ROW = 'WALL_ROW',
  WALL_COLUMN = 'WALL_COLUMN',
  WALL_LEFT_TOP = 'WALL_LEFT_TOP',
  WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
  WALL_LEFT_BOTTOM = 'WALL_LEFT_BOTTOM',
  WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
  CLIFF_LEFT = 'CLIFF_ROW_START',
  CLIFF_CENTER = 'CLIFF_ROW_CENTER',
  CLIFF_RIGHT = 'CLIFF_ROW_END',
  FLOOR = 'FLOOR',
}


export enum EVENT_ENUM {
  NEXT_LEVEL = 'NEXT_LEVEL',
  PLAYER_CTRL = 'PLAYER_CTRL',
  PLAYER_BORN = 'PLAYER_BORN',
  PLAYER_MOVE_END = 'PLAYER_MOVE_END',
  ATTACK_PLAYER = 'ATTACK_PLAYER',
  ATTACK_ENEMY = 'ATTACK_ENEMY',
  DOOR_OPEN = 'DOOR_OPEN'
}


export enum CONTROLLER_NUM {
  TOP = 'TOP',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  BOTTOM = 'BOTTOM',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT'
}

export enum FSM_PARAMS_TYPE_ENUM {
  NUMBER = 'NUMBER',
  TRIGGER = 'TRIGGER'
}

export enum PARAMS_NAME_ENUM {
  IDLE = 'IDLE',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
  DIRECTION = 'DIRECTION',
  BLOCK_FRONT = 'BLOCK_FRONT',
  BLOCK_TURN_LEFT = 'BLOCK_TURN_LEFT',
  BLOCK_TURN_RIGHT = 'BLOCK_TURN_RIGHT',
  ATTACK = 'ATTACK',
  DEATH = 'DEATH',
  DEATH_ON_AIR = 'DEATH_ON_AIR',

  SPIKES_TOTAL_COUNT = 'SPIKES_TOTAL_COUNT',
  SPIKES_CUR_COUNT = 'SPIKES_CUR_COUNT',
}

export enum DIRECTION_ENUM {
  TOP = 'TOP',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  BOTTOM = 'BOTTOM',
}

export enum ENTITY_STATE_ENUM {
  IDLE = 'IDLE',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
  BLOCK_FRONT = 'BLOCK_FRONT',
  BLOCK_TURN_LEFT = 'BLOCK_TURN_LEFT',
  BLOCK_TURN_RIGHT = 'BLOCK_TURN_RIGHT',
  ATTACK = 'ATTACK',
  DEATH = 'DEATH',
  DEATH_ON_AIR = 'DEATH_ON_AIR',
}

export enum DIRECTION_ORDER_ENUM {
  TOP = 0,
  RIGHT = 1,
  LEFT = 2,
  BOTTOM = 3,
}

export enum ENTITY_TYPE_ENUM {
  PLAYER = 'PLAYER',
  WOODEN_SKELETON = 'WOODEN_SKELETON',
  IRON_SKELETON = 'IRON_SKELETON',
  DOOR = 'DOOR',
  BURST = 'BURST',

  SPIKES_ONE = 'SPIKES_ONE',
  SPIKES_TWO = 'SPIKES_TWO',
  SPIKES_THREE = 'SPIKES_THREE',
  SPIKES_FOUR = 'SPIKES_FOUR',
}

// 尖刺当前点数枚举
export enum SPIKES_COUNT_ENUM {
  ZERO = 'ZERO',
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
}

// 尖刺类型和总点数映射
export enum SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM {
  SPIKES_ONE = 2,
  SPIKES_TWO = 3,
  SPIKES_THREE = 4,
  SPIKES_FOUR = 5,
}

// 尖刺点数类型和数字映射
export enum SPIKES_COUNT_MAP_NUMBER_ENUM {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}
