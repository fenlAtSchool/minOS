/*

___  ____ _ _      _   __                     _ 	
|  \/  (_) | |    | | / /                    | |	
| .  . |_| | | __ | |/ /  ___ _ __ _ __   ___| |	
| |\/| | | | |/ / |    \ / _ \ '__| '_ \ / _ \ |	
| |  | | | |   <  | |\  \  __/ |  | | | |  __/ |	
\_|  |_/_|_|_|\_\ \_| \_/\___|_|  |_| |_|\___|_|	

For Bloxd.io MinOS Systems
*/
function onPlayerClick(id){
	if(id == user){
		registerClick = true
	}
}
user = 99999
function log(x, y){
	api.broadcastMessage(`minos-module-${x}: ${y}`)
}
function getFile(x, r = 0){
  let m = followPath(x, r)
  let n = api.getBlockData(1e5,m,0)?.persisted?.shared.c
  if(n == undefined){
		throw new Error(`fileNotFoundError: ${x}`)
    return false
  }
  let str = Array.from({length: n}, (_,i) => api.getBlockData(1e5,m,i + 1).persisted.shared.c)
  str = JSON.parse(str.join(''))
  return str 
}
function loadChunk(x){
	x = Math.floor(x/32)
	api.getBlock(1e5, 32*x + 16, 0)
}
function setFile(x,z){
	try{
  	let n = JSON.stringify(z).match(/.{1,300}/g)
  	let m = followPath(x)
		api.setBlockData(1e5, m, 0, {persisted: {shared: {c: n.length}}})
		for(let i = 0; i < n.length; i++){
  			api.setBlockData(1e5,m,i + 1,{persisted: {shared: {c: n[i]}}})
		}
	} catch {
		log("kernel","Warning: setFile not working")
		//requestExecFunction(() => setFile(x, z), "")
	}
}
function setFileAttribute(x,a,z){
  let m = getFile(x)
  m[a] = z
  setFile(x,m)
}
function followPath(x, f = 0){
  if(typeof(x) == "number"){
    return x
  }
  if(typeof(x) == "string"){
    x = x.split("/")
  }
  let j = []
  for(let i of x){
    f = (getFile(f).contents)
	j = f.map(m => getFile(m))
    j = j.map(m => m.name + m.extension)
    if(!j.includes(i)){
      throw new Error(`invalidFilePathError: ${x}`)
      return false
    }
	f = f[j.indexOf(i)]
  }
  return f
}
function deleteFile(z,x){
  z = followPath(z)
  x = followPath(x)
  let m = getFile(x)
  if(m.extension == ''){
    m.contents.forEach(i => deleteFile(x, i) )
  }
  setFile(x, {})
  let f = getFile(z)
  f.contents.splice(f.indexOf(x), 1)
  setFile(z, f)
}
function newFile(z,x){
  z = followPath(z)
  let f = getFile(z)
  let r = getFile(-1)
  r.fileCount++
  f.contents[f.contents.length] = r.fileCount
  setFile(z, f)
  setFile(r.fileCount, x)
  setFile(-1, r)
  log("kernel", `Succesful File Created: ${x.name + x.extension}`)
  return r.fileCount
}

function boot(id){
  functions = {tick: 0, stack: {}}
  user = id
  loadChunk(0)
  executeCFF('.pack', 'System/Library/init.pack')
  requestExecFunction(() => init(), 'bootupCode')
  log("kernel", "Succesful Boot")
}

function executeCFF(extension, data){
  let tr = `System/Library/${extension}.cff`
  tr = getFile(tr).contents
  tr = eval(`let data = '${data}'; let path = '${tr}'; ${tr}`)
  if(tr != "HALT"){
    requestExecFunction(() => executeCFF(extension, data))
    return tr
  }
}
function execute(file){
	let m = file.split('.').at(-1)
	executeCFF(m,file)
}

functions = {tick: 0, stack: {}}
function requestExecFunction(func, dummy){ // Legacy Handler
	scheduleFirstUnused(func)
}
function schedule(x, tick, onError = null){
	let m = functions.stack[functions.tick + tick]
	if(!m){
		m = []
	}
	m[m.length] = {exec: x, onError: onError}
	functions.stack[functions.stack.length + tick] = m
}
function scheduleFirstUnused(x, min = functions.tick+1, onError = null){
	while(functions.stack[min]){
		min++
	}
	functions.stack[min] = [{exec: x, onError: onError}]
}
function scheduleLast(x,shift=1,onError = null){
	let m = max(...functions.stack.keys + functions.tick) + shift
	functions.stack[m] = [{exec: x, onError: onError}]
}
overClock = false
function minitick(){
// Contributed by bulebrainbrand
	if(Object.hasOwn(functions.stack,functions.tick.toString())){
		let m = functions.stack[functions.tick]
		let n = m.length
		mint_finish = true
		for(mint = 0; mint < n; mint++){
			try{
				m[mint].exec()
			} catch(error){
				log('kernel', `Error: ${error}`)
				m[mint].onError()
			}
		}
		mint_finish = false
		delete functions.stack[functions.tick]
	}
	functions.tick++
}
Object.defineProperty(globalThis.InternalError.prototype, "name", { // Overclocking
    configurable: true,
    get: () => {
        if(overClock && mint_finish){
			let m = functions.stack[functions.tick]
			let n = m.length
			for(; mint < n; mint++){
				try{
					m[mint].exec()
				} catch(error){
					log('kernel', `Error: ${error}`)
					m[mint].onError()
				}
			}
		}
		return
    }
})
function tick(){
	minitick()
}


/*
Minification:

function onPlayerClick(e){e==user&&(registerClick=!0)}function log(e,t){api.broadcastMessage(`minos-module-${e}: ${t}`)}function getFile(e,t=0){let n=followPath(e,t),o=api.getBlockData(1e5,n,0)?.persisted?.shared.c;if(void 0==o)throw Error(`fileNotFoundError: ${e}`);let l=Array.from({length:o},(e,t)=>api.getBlockData(1e5,n,t+1).persisted.shared.c);return JSON.parse(l.join(""))}function loadChunk(e){e=Math.floor(e/32),api.getBlock(1e5,32*e+16,0)}function setFile(e,t){try{let n=JSON.stringify(t).match(/.{1,300}/g),o=followPath(e);api.setBlockData(1e5,o,0,{persisted:{shared:{c:n.length}}});for(let l=0;l<n.length;l++)api.setBlockData(1e5,o,l+1,{persisted:{shared:{c:n[l]}}})}catch{log("kernel","Warning: setFile not working")}}function setFileAttribute(e,t,n){let o=getFile(e);o[t]=n,setFile(e,o)}function followPath(e,t=0){if("number"==typeof e)return e;"string"==typeof e&&(e=e.split("/"));let n=[];for(let o of e){if(!(n=(n=(t=getFile(t).contents).map(e=>getFile(e))).map(e=>e.name+e.extension)).includes(o))throw Error(`invalidFilePathError: ${e}`);t=t[n.indexOf(o)]}return t}function deleteFile(e,t){e=followPath(e),t=followPath(t);let n=getFile(t);""==n.extension&&n.contents.forEach(e=>deleteFile(t,e)),setFile(t,{});let o=getFile(e);o.contents.splice(o.indexOf(t),1),setFile(e,o)}function newFile(e,t){e=followPath(e);let n=getFile(e),o=getFile(-1);return o.fileCount++,n.contents[n.contents.length]=o.fileCount,setFile(e,n),setFile(o.fileCount,t),setFile(-1,o),log("kernel",`Succesful File Created: ${t.name+t.extension}`),o.fileCount}function boot(e){functions={tick:0,stack:{}},user=e,loadChunk(0),executeCFF(".pack","System/Library/init.pack"),requestExecFunction(()=>init(),"bootupCode"),log("kernel","Succesful Boot")}function executeCFF(extension,data){let tr=`System/Library/${extension}.cff`;if(tr=getFile(tr).contents,"HALT"!=(tr=eval(`let data = '${data}'; let path = '${tr}'; ${tr}`)))return requestExecFunction(()=>executeCFF(extension,data)),tr}function execute(e){executeCFF(e.split(".").at(-1),e)}function requestExecFunction(e,t){scheduleFirstUnused(e)}function schedule(e,t,n=null){let o=functions.stack[functions.tick+t];o||(o=[]),o[o.length]={exec:e,onError:n},functions.stack[functions.stack.length+t]=o}function scheduleFirstUnused(e,t=functions.tick+1,n=null){for(;functions.stack[t];)t++;functions.stack[t]=[{exec:e,onError:n}]}function scheduleLast(e,t=1,n=null){let o=max(...functions.stack.keys+functions.tick)+t;functions.stack[o]=[{exec:e,onError:n}]}function minitick(){if(Object.hasOwn(functions.stack,functions.tick.toString())){let e=functions.stack[functions.tick],t=e.length;for(mint=0,mint_finish=!0;mint<t;mint++)try{e[mint].exec()}catch(n){log("kernel",`Error: ${n}`),e[mint].onError()}mint_finish=!1,delete functions.stack[functions.tick]}functions.tick++}function tick(){minitick()}user=99999,functions={tick:0,stack:{}},overClock=!1,Object.defineProperty(globalThis.InternalError.prototype,"name",{configurable:!0,get(){if(overClock&&mint_finish){let e=functions.stack[functions.tick],t=e.length;for(;mint<t;mint++)try{e[mint].exec()}catch(n){log("kernel",`Error: ${n}`),e[mint].onError()}}}});

*/
