require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage:')
  console.log('  node mongo.js <password> [name] [phone]')
  console.log('\nExamples:')
  console.log('  node mongo.js yourpassword "Anna" 040-1234556')
  console.log('  node mongo.js yourpassword')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const url = `mongodb+srv://angelommpm:${password}@cluster01.l3zr18e.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster01`

mongoose
  .connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err)
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && phone) {
  const person = new Person({ name, phone })
  person.save().then(() => {
    console.log(`Added ${name} number ${phone} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then((result) => {
    console.log('Phonebook:')
    result.forEach((person) => console.log(`${person.name} ${person.phone}`))
    mongoose.connection.close()
  })
}
