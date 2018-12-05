const Rpc = require('../lib/protocol')

const rpc = new Rpc()
const buf = rpc.encode({
  name: 'ym'
})
const res = rpc.decode(buf)
console.log(res)

// const rpc2 = new Rpc()
// const buf2 = rpc2.encode({
//   name: 'ym2'
// })
// const res2 = rpc.decode(buf2)
// console.log(res2)

// const buf = Buffer.alloc(6)
// buf.writeUInt16BE(57005, 0)
// console.log(buf.readUInt16BE(0))
