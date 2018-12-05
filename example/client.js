const Client = require('../lib').client
const client = new Client({
  service: 'com.nodejs.test.TestService'
})

client.call('add', [1, 2], res => {
  console.log('local client', res)
})
