import { _decorator, Component, director, ProgressBar, resources } from 'cc'
import { SCENE_ENUM } from '../enums'

const { ccclass, property } = _decorator

@ccclass('LoadingManager')
export class LoadingManager extends Component {
  @property(ProgressBar)
  bar: ProgressBar = null

  onLoad() {
    resources.preloadDir('/texture/ctrl', (cur, total) => {
      this.bar.progress = cur / total
    }, () => {
      director.loadScene(SCENE_ENUM.START)
    })
  }

}