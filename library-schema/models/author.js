const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
 
  born: {
    type: Number,
  },
})

schema.plugin(uniqueValidator)

const Author = mongoose.model('Author', schema)
module.exports = Author