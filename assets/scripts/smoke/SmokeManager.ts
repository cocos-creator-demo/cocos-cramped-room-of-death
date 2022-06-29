import { _decorator } from 'cc'
import { SmokeStateMachine } from './SmokeStateMachine'

import { EntityManager } from '../base/EntityManager'
import { IEntity } from '../levels'

const { ccclass } = _decorator


@ccclass('SmokeManager')
export class SmokeManager extends EntityManager {
  targetX: number = 0
  targetY: number = 0
  fsm: SmokeStateMachine

  init(params: IEntity) {
    this.fsm = this.addComponent(SmokeStateMachine)
    this.fsm.init()
    super.init(params)
  }
}