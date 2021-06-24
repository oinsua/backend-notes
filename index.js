const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json()) // To send object json on post request
app.use(cors())

let notes = [
  {
    id: 1,
    content: 'Me tengo que suscribir a midudev 5',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Me tengo que suscribir a midudev',
    date: '2019-05-30T18:25:35.098Z',
    important: true
  },
  {
    id: 3,
    content: 'Repasar los retos de JS',
    date: '2019-05-30T18:39:31.098Z',
    important: true
  }
]

app.get('/', (request, response) => {
  console.log('mostrar mensaje hello')
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  console.log('mostrar todas la notes')
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const { id } = request.params
  const note = notes.find(note => note.id === Number(id))
  if (note) {
    console.log({ note })
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const { id } = request.params
  console.log({ id })
  notes = notes.filter(note => note.id !== Number(id))
  console.log({ notes })
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (note || note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }
  const ids = notes.map(note => note.id)
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
  response.json(notes)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not Found'
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
