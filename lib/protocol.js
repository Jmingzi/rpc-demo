const protocolDefault = {
  packetId: 0,
  // packetType: 'request',
  data: null,
  protocolType: 'node-rpc',
  // protocolVersion: '1.0.0',
  options: {
    dataFrom: 'rpc',
  },
  timeout: 20000
}

// buffer.constants.MAX_LENGTH 2^30-1 / 2^31-1，也就是1G / 2G
const byteBuffer = Buffer.alloc(1024 * 1024)
let byteOffset = 0
let packetId = 0

class Protocol {
  constructor(options = {}) {
    this.options = Object.assign(options, protocolDefault)
    return this.options
  }

  encode(data) {
    if (data) {
      this.options = Object.assign(this.options, { data })
    }
    const { protocolType, packetType } = this.options
    const firstField = packetType === 'request' ? 0x01 : 0x02
    byteBuffer.fill(firstField, byteOffset)
    byteOffset += 1
    byteBuffer.fill(protocolType, byteOffset)
    byteOffset += protocolType.length
    byteBuffer.fill(packetId, byteOffset)
  }

  decode() {

  }
}

module.exports = Protocol
