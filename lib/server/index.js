const net = require('net')
const util = require('util')
const debuglog = util.debuglog('rpc_server')
const Protocol = require('../protocol')
const protocol = new Protocol({
  packetType: 'response'
})

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
      // const ret = socket.write(JSON.stringify(['add']))
      const ret = socket.write(protocol.encode({ type: 'service', value: ['add'] }))
    })

    this.server.listen(this.options.port, () => {
      console.log('server start')
    })
  }

  handleRemoteCall(socket) {
    socket.on('data', chunk => {
      const resData = protocol.decode(chunk)
      const { packetType, data } = resData
      console.log('packetType', packetType)
      if (data.type === 'call') {
        const res = this[data.value.apiName](data.value.args)
        setTimeout(() => {
          socket.write(protocol.encode({
            type: 'call',
            value: res,
            callbackId: data.callbackId
          }))
        }, 2000)
      }
    })
  }

  add(argv) {
    return argv[0] + argv[1]
  }
}

module.exports = RpcServer
