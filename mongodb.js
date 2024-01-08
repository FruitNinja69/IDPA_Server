const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const itemSchema = new mongoose.Schema({
  MitarbeiterName: String,
  Kinderanzahl: Number,
  BruttoLohn: Number,
  Geburtsdatum: Date,
})

const ToDo = mongoose.model('Mitarbeiter', itemSchema)

mongoose.set('strictQuery', false)

mongoose
  .connect(
    `mongodb+srv://Thikal:Thikal@cluster.rkr89yd.mongodb.net/IDPA?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('Connected to database')
  })

app.get('/mitarbeiter', (req, res) => {
  ToDo.find({})
    .then((data) => {
      res.json(data)
      console.log(data)
    })
    .catch((err) => console.log(err))
})

app.get('/mitarbeiter/:id', (req, res) => {
  const itemId = req.params.id

  ToDo.findById(itemId)
    .then((data) => {
      if (!data) {
        res.status(404).json({ error: 'Mitarbeiter not found' })
      } else {
        res.json(data)
        console.log(data)
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: 'Internal Server Error' })
    })
})

app.delete('/mitarbeiter/:id', (req, res) => {
  const itemId = req.params.id

  ToDo.findByIdAndDelete(itemId)
    .then((data) => {
      if (!data) {
        res.status(404).json({ error: 'Mitarbeiter not found' })
      } else {
        res.json(data)
        console.log(data)
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: 'Internal Server Error' })
    })
})

app.post('/mitarbeiter', async (req, res) => {
  try {
    const newMitarbieter = req.body
    console.log(req.body)
    const createdMitarbeiter = await ToDo.create(newMitarbieter)

    res.status(201).json(createdMitarbeiter)
    console.log('Mitarbeiter created:', createdMitarbeiter)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.put('/mitarbeiter/:id', (req, res) => {
  const itemId = req.params.id
  const updatedToDo = req.body

  ToDo.findByIdAndUpdate(itemId, updatedToDo, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).json({ error: 'Todo not found' })
      } else {
        res.json(data)
        console.log('Mitarbeiter updated:', data)
      }
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: 'Internal Server Error' })
    })
})

app.listen(8080, () => {
  console.log('Server running on Port 8080')
})
