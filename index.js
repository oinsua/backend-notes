const express = require('express')
const app = express()
const cors = require('cors')
require('./database/Connect')
const Note = require('./model/model')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

Sentry.init({
  dsn: 'https://b8ea411a33eb4e4ab201bc41a2343261@o718059.ingest.sentry.io/5780466',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(express.json()) // To send object json on post request
app.use(cors())

// To server statics files width middleware
app.use('/images', express.static('images'))

app.get('/', (request, response) => {
  console.log('mostrar mensaje hello')
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response, next) => {
  console.log('mostrar todas la notes')
  Note.find({})
    .then(notes => {
      response.status(200).json(notes)
    })
    .catch(err => next(err))
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  /*  const note = notes.find(note => note.id === Number(id)) */
  console.log(id)
  Note.findById(id)
    .then(note => {
      if (note) {
        console.log({ note })
        response.status(200).json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => {
      /*   console.log(err.message)
        response.status(400).end() */
      next(err)
    })
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  console.log({ id })
  Note.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(err => next(err))
})

app.post('/api/notes', (request, response, next) => {
  const note = request.body
  console.log({ note })
  console.log(note.content)
  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  })

  newNote.save()
    .then(saveNote => {
      console.log(saveNote)
      response.status(201).json(saveNote)
    })
    .catch(err => next(err))

  /* const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)
  console.log({ note })

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }
  console.log({ newNote })

  notes = [...notes, newNote]

  console.log({ notes })
  response.json(notes) */
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body
  const newNote = {
    content: note.content,
    important: note.important
  }
  Note.findByIdAndUpdate(id, newNote, { new: true })
    .then(result => {
      response.status(204).json(result)
    })
    .catch(err => next(err))
})

app.use((err, request, response, next) => {
  /* console.error(error) */

  if (err.name === 'CastError') {
    response.status(400).send({
      error: 'id used is malformed'
    })
  } else {
    response.status(500).end()
  }
})

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.use((request, response) => {
  response.status(404).json({
    error: 'Not Found'
  })
})

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
