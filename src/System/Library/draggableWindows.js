globalThis.dragWindow = class extends Button{
  constructor(x, y, dx, dy, func){
    super(x, y, dx, dy, func)
    this.isDragged = false
    this.drawImg(2, 2, [[config.dark,config.dark,config.dark],[config.dark,config.dark,config.dark],[config.dark,config.dark,config.dark]])
    clickFunctions.push(() => this.drag())
  }
  drawImg(x, y, d){
    for(let [iidx, i] of d.entries()){
      for(let [jidx, j] of i.entries()){
        this.setPixel(x+iidx, y+jidx, j)
      }
    }
  }
  cursorOnWindow(){
    return inBounds(userCursorPos[0], this.startx, this.startx + this.x) && inBounds(userCursorPos[1], this.starty, this.starty + this.y)
  }
  drag(){
    clickFunctions.push(() => this.drag())
    if(!this.cursorOnWindow()){
      return
    }
    this.isDragged = !this.isDragged
    if(this.isDragged){
      let par = this.getParams()
      this.relative = [userCursorPos[0] - par.startx, userCursorPos[1] - par.starty]
      if(inBounds(this.relative[0], 2, 4) && inBounds(this.relative[1], 2, 4)){
        scheduleFirstUnused(() => this.follow())
      }
    }
  }
  follow(){
    if(this.isDragged){
      this.startx = userCursorPos[0] - this.relative[0]
      this.starty = userCursorPos[1] - this.relative[1]
    } else {
      scheduleFirstUnused(() => this.follow())
    }
  }
}
/*
###############################
#     # # ### ### ##  ### # # #
# ### # #  #  # # # # # # # # #
# ### ###  #  # # # # # # ### #
# ### ###  #  # # # # # # ### #
#     ### ### # # ##  ### ### #
###############################
*/
