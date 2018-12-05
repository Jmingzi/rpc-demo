const buf = Buffer.alloc(100)

buf.fill(500, 0, 1)

console.log(buf)
console.log(JSON.stringify(buf))
