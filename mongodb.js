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

const Mitarbeiter = mongoose.model('Mitarbeiter', itemSchema)

mongoose.set('strictQuery', false)

mongoose
  .connect(
    `mongodb+srv://Thikal:Thikal@cluster.rkr89yd.mongodb.net/IDPA?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('Connected to database')
  })

app.get('/mitarbeiter', (req, res) => {
  Mitarbeiter.find({})
    .then((data) => {
      // Konvertieren Sie das Geburtsdatum im Ergebnis in das gewünschte Format
      const mitarbeiterData = data.map((mitarbeiter) => ({
        ...mitarbeiter._doc,
        Geburtsdatum: mitarbeiter.Geburtsdatum.toISOString().split('T')[0],
      }));
      res.json(mitarbeiterData);
    })
    .catch((err) => console.log(err));
});

app.get('/mitarbeiter/:id', (req, res) => {
  const itemId = req.params.id

  Mitarbeiter.findById(itemId)
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

  Mitarbeiter.findByIdAndDelete(itemId)
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
    const createdMitarbeiter = await Mitarbeiter.create(newMitarbieter)

    res.status(201).json(createdMitarbeiter)
    console.log('Mitarbeiter created:', createdMitarbeiter)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.put('/mitarbeiter/:id', (req, res) => {
  const itemId = req.params.id
  const updatedMitarbeiter = req.body

  Mitarbeiter.findByIdAndUpdate(itemId, updatedMitarbeiter, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).json({ error: 'Mitarbeiter not found' })
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
