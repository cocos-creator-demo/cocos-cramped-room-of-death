import { _decorator, Component, Event } from 'cc'
import EventManager from '../runtime/EventManager'
import { CONTROLLER_NUM, EVENT_ENUM } from '../enums'

const { ccclass } = _decorator

@ccclass('ControllerManager')
export class ControllerManager extends Component {

  handleCtrl(evt: Event, dir: string) {
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL, dir as CONTROLLER_NUM)
  }
}