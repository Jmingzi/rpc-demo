const net = require('net')
const util = require('util')
const debuglog = util.debuglog('rpc_server')

const defaultOptions = {
  port: 8124
}

class RpcServer {
  constructor(options = {}) {
    this.options = {
      ...defaultOptions,
      ...options
    }

    this.server = net.createServer({ allowHalfOpen: false }, socket => {
      this.handleRemoteCall(socket)

      socket.on('end', () => {
        console.log('client disconnected')
      })
      socket.pipe(socket)
    })

    this.start(options)
    return this.server
  }

  start() {
    this.server.on('connection', socket => {
      const ret = socket.write(JSON.stringify(['add']))
    })

    this.server.listen(this.options.port, () => {
      console.log('server start')
    })
  }

  handleRemoteCall(socket) {
    socket.on('data', chunk => {
      // console.log(chunk.toString())
      const { apiName, args } = JSON.parse(chunk.toString())
      const res = this[apiName](args)

      setTimeout(() => {
        socket.write(JSON.stringify(res))
      }, 2000)
    })
  }

  add(argv) {
    return argv[0] + argv[1]
  }
}

module.exports = RpcServer
