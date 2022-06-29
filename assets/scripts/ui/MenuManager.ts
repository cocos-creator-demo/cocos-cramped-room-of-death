import { _decorator, Component } from 'cc'
import EventManager from '../runtime/EventManager'
import { EVENT_ENUM } from '../enums'

const { ccclass } = _decorator

@ccclass('MenuManager')
export class MenuManager extends Component {

  handleUndo() {
    EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP)
  }

  handleRestart(){
    EventManager.Instance.emit(EVENT_ENUM.RESTART)
  }

  handleQuit(){
    EventManager.Instance.emit(EVENT_ENUM.QUIT)
  }
}