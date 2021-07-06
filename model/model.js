const mongoose = require('mongoose')

const { Schema, model } = mongoose

const schema = new Schema({
  content: String,
  date: Date,
  important: Boolean
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = model('Note', schema)

module.exports = Note

/* const note = new Note({
  content: 'Mi primera app',
  date: new Date(),
  import: true
})
note.save()
  .then(result => {
    console.log('result:', result)
    mongoose.connection.close()
  })
  .catch(err => console.log(err)) */
