import { _decorator, Component,Node, director } from 'cc'
import FaderManager from '../runtime/FaderManager'
import { SCENE_ENUM } from '../enums'

const { ccclass } = _decorator

@ccclass('StartManager')
export class StartManager extends Component {

  onLoad() {
    FaderManager.Instance.fadeOut()
    this.node.once(Node.EventType.TOUCH_END, this.handleStart, this)
  }

  async handleStart(){
    await FaderManager.Instance.fadeOut()
    director.loadScene(SCENE_ENUM.BATTLE)
  }
}