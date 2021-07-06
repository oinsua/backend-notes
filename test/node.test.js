const superTest = require('supertest')
const { app, server } = require('../index')
const mongoose = require('mongoose')

const api = superTest(app)

// import model to mongoAtlas
const Note = require('../model/model')

// Initial Data to insert on the database before of Test
const initialNotes = [
  {
    content: 'Aprendiendo FullStack',
    important: true,
    date: new Date()
  },
  {
    content: 'Aprendiendo Flutter',
    important: false,
    date: new Date()
  }
]

beforeAll(async () => {
  jest.setTimeout(10000) // change timeout to 10 seconds
})

beforeEach(async () => {
  await Note.deleteMany({})
  const note1 = new Note(initialNotes[0])
  await note1.save()

  const note2 = new Note(initialNotes[1])
  await note2.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('the firt notes is about learned', async () => {
  const response = await api.get('/api/notes')
  expect(response.body[0].content).toBe('Aprendiendo FullStack')
})

test('the note is contain in initialNotes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(note => note.content)

  expect(contents).toContain('Aprendiendo FullStack')
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'Aprendiendo Nodejs',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = await response.body.map(note => note.content)

  expect(response.body).toHaveLength((initialNotes.length) + 1)

  expect(contents).toContain(newNote.content)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
