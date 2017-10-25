const winston = require('winston')
const axios = require('axios')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error', timstamp: true}),
    new winston.transports.File({ filename: 'combined.log', timstamp: true})
  ]
});

class LogResponse {
  constructor({data, status, headers, config}) {
      Object.assign(this, {}, {data, status, headers, config})
      this.date = new Date();
  }
}

class LogError extends LogResponse {
  constructor({response}) {
    super(response)
  }
}

function testApi(url) {
  console.log('ping')
  return axios.get(url).then(response => {
    logger.info(new LogResponse(response))
    return response
  }).catch(error => {
    logger.error(new LogError(error))
    return Promise.resolve(error.response)
  })
}

function testWithInterval(url, interval) {
  setTimeout(() => {
    testApi(url).then(() => {
      testWithInterval(url, interval)
    })
  }, interval)
}

testWithInterval('http://localhost:81/', 45 * 1000)