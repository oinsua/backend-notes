const mongoose = require('mongoose')
require('dotenv').config()

const { URL_CONNECTION, URL_CONNECTION_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test' ? URL_CONNECTION_TEST : URL_CONNECTION

// mongoose connection
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('Database is connected')
  })
  .catch(err => {
    console.log(err)
  })

process.on('uncaughtException', () => {
  mongoose.connection.disconnect()
})
