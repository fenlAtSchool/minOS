/*
Robust SetFile system that extends on kernel

setFile(file, data) : Set a file. If data is not an object that contains name, extension, and contents, then setFileAttribute will be used instead of setFile.
*/
globalThis.files = {
  renameFile(file, name){
    setFileAttribute(file, 'name', name)
  },
  renameFileExtension(file, name){
    setFileAttribute(file, 'extension', name)
  },
  renameFileName(file, name){
    let r = name.split('.')
    setFileAttribute(file, 'extension', r.at(-1))
    r = r.pop()
    r = r.join('.')
    setFileAttribute(file, 'name', r)
  }
}
