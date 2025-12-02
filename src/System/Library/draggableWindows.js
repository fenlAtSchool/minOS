globalThis.draggableWindow = class extends Button{
  constructor(x, y, dx, dy, func){
    super(x, y, dx, dy, func)
    this.isBeingDragged = false
    this.drawImg(0,0, [config.dark, config.dark, config.dark, config.dark, config.dark, config.dark, config.light, config.light, config.light, config.dark, config.dark, config.light, config.dark, config.light, config.dark, config.dark, config.light, config.light, config.light, config.dark, config.dark, config.dark, config.dark, config.dark, config.dark])
    fillInOutline(0, this.dx, 4, 4)
  }
  drawImg(x, y, f){
    for(let [a, i] of f){
      for(let [b, j] of i){
        this.setPixel(a, b, j)
      }
    }
  }
  exec(){
    relative = [userCursorPos[0]-this.x, userCursorPos[1]-this.y]
  }
  
}
