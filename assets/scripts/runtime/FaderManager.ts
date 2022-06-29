import { game, RenderRoot2D } from 'cc'
import Singleton from '../base/Singleton'
import { DEFAULT_FADE_DURATION, DrawManager } from '../ui/DrawManager'
import { createUINode } from '../utils'

export default class FaderManager extends Singleton {
  private _fader: DrawManager = null

  static get Instance() {
    return super.getInstance<FaderManager>()
  }

  get fader(): DrawManager {
    if (this._fader === null) {
      const root = createUINode()
      root.addComponent(RenderRoot2D)

      const node = createUINode()
      node.setParent(root)
      this._fader = node.addComponent(DrawManager)
      this._fader.init()
      game.addPersistRootNode(root)
    }
    return this._fader
  }

  async fadeIn(duration: number = DEFAULT_FADE_DURATION) {
    await this.fader.fadeIn(duration)
  }

  async fadeOut(duration: number = DEFAULT_FADE_DURATION) {
    await this.fader.fadeOut(duration)
  }

  async mask() {
    await this.fader.mask()
  }

}