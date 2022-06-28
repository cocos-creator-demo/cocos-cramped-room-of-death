import Singleton from '../base/Singleton'


interface EventRecord {
  func: Function,
  ctx: unknown
}

export default class EventManager extends Singleton {
  static get Instance() {
    return super.getInstance<EventManager>()
  }

  eventDic: Map<string, EventRecord[]> = new Map()

  on(name: string, func: Function, ctx?: unknown) {
    const list = this.eventDic.get(name) || []
    list.push({ func, ctx })
    this.eventDic.set(name, list)
  }

  off(name, func) {
    const idx = this.eventDic.get(name)?.findIndex(row => row.func === func)
    idx > -1 && this.eventDic.get(name).splice(idx, 1)
  }

  emit(name, ...params: unknown[]) {
    this.eventDic.get(name)?.forEach((i) => {
      i.ctx ? i.func.apply(i.ctx, params) : i.func(...params)
    })
  }

  clear() {
    this.eventDic.clear()
  }
}