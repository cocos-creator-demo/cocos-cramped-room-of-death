import { _decorator } from 'cc'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../enums'
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine'

import { EnemyManager } from '../base/EnemyManager'

const { ccclass } = _decorator


@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {
  targetX: number = 0
  targetY: number = 0
  fsm: IronSkeletonStateMachine

  init() {
    this.fsm = this.addComponent(IronSkeletonStateMachine)
    this.fsm.init()
    super.init({
      x: 2,
      y: 6,
      type: ENTITY_TYPE_ENUM.IRON_SKELETON,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })

  }
}