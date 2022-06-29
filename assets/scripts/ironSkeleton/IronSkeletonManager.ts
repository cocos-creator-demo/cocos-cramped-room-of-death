import { _decorator } from 'cc'
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine'

import { EnemyManager } from '../base/EnemyManager'
import { IEntity } from '../levels'

const { ccclass } = _decorator


@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {
  targetX: number = 0
  targetY: number = 0
  fsm: IronSkeletonStateMachine

  init(params:IEntity) {
    this.fsm = this.addComponent(IronSkeletonStateMachine)
    this.fsm.init()
    super.init(params)
  }
}