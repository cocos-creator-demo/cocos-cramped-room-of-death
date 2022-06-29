import { Component, game, _decorator } from 'cc'
import EventManager from '../runtime/EventManager'
import { CONTROLLER_NUM, EVENT_ENUM, SHAKE_TYPE_ENUM } from '../enums'

const { ccclass } = _decorator

@ccclass('ShakeManager')
export class ShakeManager extends Component {
  private isShaking: boolean
  private lastTime: number
  private oldPos: { x: number; y: number } = { x: 0, y: 0 }
  private shakeType: CONTROLLER_NUM = CONTROLLER_NUM.TOP

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onShake)
  }

  update() {
    this.onShakeUpdate()
  }

  onShake(type: CONTROLLER_NUM) {
    if (this.isShaking) return
    this.isShaking = true
    this.lastTime = game.totalTime
    this.shakeType = type

    this.oldPos.x = this.node.position.x
    this.oldPos.y = this.node.position.y
  }

  stop() {
    this.isShaking = false
  }

  onShakeUpdate() {
    if (!this.isShaking) return
    //振幅
    const shakeAmount = 1.6
    //持续时间
    const duration = 200
    //频率
    const frequency = 12
    //当前时间
    const curSecond = (game.totalTime - this.lastTime) / 1000
    //总时间
    const totalSecond = duration / 1000
    const offset = shakeAmount * Math.sin(frequency * Math.PI * curSecond) // 正弦函数
    if (this.shakeType === CONTROLLER_NUM.TOP) {
      this.node.setPosition(this.oldPos.x, this.oldPos.y - offset)
    } else if (this.shakeType === CONTROLLER_NUM.BOTTOM) {
      this.node.setPosition(this.oldPos.x, this.oldPos.y + offset)
    } else if (this.shakeType === CONTROLLER_NUM.LEFT) {
      this.node.setPosition(this.oldPos.x - offset, this.oldPos.y)
    } else if (this.shakeType === CONTROLLER_NUM.RIGHT) {
      this.node.setPosition(this.oldPos.x + offset, this.oldPos.y)
    }
    if (curSecond > totalSecond) {
      this.isShaking = false
      this.node.setPosition(this.oldPos.x, this.oldPos.y)
    }
  }
}