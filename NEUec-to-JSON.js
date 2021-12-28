const fs = require('fs');
const input = require('readline').createInterface({input: process.stdin,output: process.stdout});
Object.prototype.toString = function() {return JSON.stringify(this)};
function write(towrite,format) {if (["json","txt"].includes(format)) return fs.promises.writeFile("./programoutput."+format,towrite.toString()).then(() => {console.log(`Output written to './programoutput.${format}'.`)})}

function parse(inp){
  if (!inp.startsWith("NEUEC/")) {return} else {inp = inp.slice(6)}
  let proc1 = {};
  JSON.parse(inp).forEach((stri) => {
    stri = stri.split(":")
    let enchname = stri[0]
    let enchcond = stri.slice(1,3).join("")
    let enchform = stri.slice(3)
    if (proc1[enchname]) {
      proc1[enchname][enchcond] = enchform;
    } else {
      proc1[enchname] = {[enchcond]:enchform};
    }
  })
  return proc1
}
function unparse(inp){ // 0: normal, 1: bold, 2: italic, 
  let proc1 = {};
  Object.entries(inp).forEach(([key,val]) => {
    key = key.replace(/"'/g,"")
    Object.entries(val).forEach(([key2,val2])=> {
      let p21 = [key2[0],key2.slice(1)]
      let p2 = ":"+p21.concat(val2).join(":")
      if (!proc1[p2]) proc1[p2] = [];
      proc1[p2].push(key)
    })
  })
  let proc2 = Object.entries(proc1).map(([key,value]) => value.join("|")+key)
  return "NEUEC/"+JSON.stringify(proc2)
}

input.question("\nWarning: Incompatible with advanced regex. Please use the '|' operator exclusively.\nOptions:\n 1> NEUEC to JSON\n 2> JSON to NEUEC\n", sel => {
  switch (sel){
    case "1":
      input.question("Input Saved Clipboard:", (encoded) => {
        let output = parse(Buffer.from(encoded, 'base64').toString('ascii'))
        write(output,"json")
      })
    break;
    case "2":
      input.question("Input Minified JSON:", (injson) => {
        let parsed = JSON.parse(injson.replace(/'/g,'"'))
        let output = Buffer.from(unparse(parsed),"ascii").toString('base64')
        write(output,"txt")
      })
    break;
    default:
      console.log("Invalid Answer.")
      return;
  }
})