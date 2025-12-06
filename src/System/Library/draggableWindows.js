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
  drag(){
    clickFunctions.push(() => this.drag())
    let par = this.getParams()
    this.relative = [userCursorPos[0] - par.startx, userCursorPos[1] - par.starty]
    if()
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
