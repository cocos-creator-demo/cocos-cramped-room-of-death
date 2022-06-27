import { AnimationClip, animation, Sprite, SpriteFrame } from 'cc'
import ResourceManager from '../runtime/ResourceManager'
import { sortSpriteFrame } from '../utils'
import { AnimationStateMachine } from './AnimationStateMachine'

const ANIMATION_SPEED = 1 / 8 // 1秒8帧

export default class AnimateState {

  animationClip: AnimationClip

  runCache: Function[] = []

  constructor(private fsm: AnimationStateMachine, private path: string, private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal) {
    this.init()
  }

  async init() {
    const spriteFrames = await ResourceManager.Instance.loadDir(this.path)

    const track = new animation.ObjectTrack() // 创建一个向量轨道
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')

    const frames: Array<[number, SpriteFrame]> = sortSpriteFrame(spriteFrames).map((item, index) => [
      index * ANIMATION_SPEED,
      item,
    ])
    track.channel.curve.assignSorted(frames)


    this.animationClip = new AnimationClip()
    this.animationClip.addTrack(track)

    this.animationClip.name = this.path
    this.animationClip.duration = frames.length * ANIMATION_SPEED
    this.animationClip.wrapMode = this.wrapMode

    if (this.runCache.length) {
      this.runCache.forEach(cb => {
        cb()
      })
      this.runCache = []
    }
  }

  run() {
    if (!this.animationClip) {
      this.runCache.push(() => {
        this.play()
      })
    } else {
      this.play()
    }
  }

  play() {
    if (this.fsm.animationComponent?.defaultClip?.name === this.animationClip.name) {
      return
    }
    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }

}