import { Layers, Node, UITransform, Vec2 } from 'cc'

const getUIMaskNumber = () => 1 << Layers.nameToLayer('UI_2D')

export const createUINode = (name: string = '') => {
  const node = new Node(name)
  node.layer = getUIMaskNumber()
  const transform = node.addComponent(UITransform)
  transform.anchorPoint = new Vec2(0, 1)
  return node
}
