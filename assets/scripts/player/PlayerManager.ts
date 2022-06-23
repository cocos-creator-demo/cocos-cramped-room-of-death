import { _decorator, animation, Animation, AnimationClip, Component, Sprite, SpriteFrame, UITransform } from 'cc'
import ResourceManager from '../runtime/ResourceManager'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import { CONTROLLER_NUM, EVENT_ENUM } from '../enums'
import EventManager from '../runtime/EventManager'

const { ccclass } = _decorator


const ANIMATION_SPEED = 1 / 8 // 1秒8帧

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  x: number = 0
  y: number = 0
  targetX: number = 0
  targetY: number = 0

  private readonly speed = 1 / 10


  init() {
    this.render()
    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.move, this)
  }

  update() {
    this.updateXY()
    this.node.setPosition(this.x * TILE_WIDTH - 1.5 * TILE_WIDTH, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }


  updateXY() {
    if (this.targetX < this.x) {
      this.x -= this.speed
    } else if (this.targetX > this.x) {

      this.x += this.speed
    }
    if (this.targetY < this.y) {
      this.y -= this.speed

    } else if (this.targetY > this.y) {
      this.y += this.speed
    }

    if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1) {
      this.x = this.targetX
      this.y = this.targetY
    }
  }

  move(dir: CONTROLLER_NUM) {
    console.log('move', dir)
    switch (dir) {
      case CONTROLLER_NUM.BOTTOM:
        this.targetY += 1
        break
      case CONTROLLER_NUM.TOP:
        this.targetY -= 1
        break
      case CONTROLLER_NUM.RIGHT:
        this.targetX += 1
        break
      case CONTROLLER_NUM.LEFT:
        this.targetX -= 1
        break
    }
  }

  async render() {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    const spriteFrames = await ResourceManager.Instance.loadDir('texture/player/idle/top')
    const track = new animation.ObjectTrack() // 创建一个向量轨道
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')

    const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [
      index * ANIMATION_SPEED,
      item,
    ])
    track.channel.curve.assignSorted(frames)


    const animationClip = new AnimationClip()
    animationClip.addTrack(track)

    animationClip.duration = frames.length * ANIMATION_SPEED
    animationClip.wrapMode = AnimationClip.WrapMode.Loop

    const animationComp = this.addComponent(Animation)

    animationComp.defaultClip = animationClip
    animationComp.play()
  }
}