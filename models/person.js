const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

// 连接
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// define personSchema
const personSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type:String,
    minlength: 8,
    required: [true, 'phone number required'],
    validate: {
      // if formed of two parts that are separated by -, 
      // the first part has two or three numbers 
      // and the second part also consists of numbers
      // https://mongoosejs.com/docs/validation.html#custom-validators
      validator: function(v) {
        return /\d{2}-\d{6}\d*|\d{3}-\d{5,?}\d*/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    }
  }
})

// 对 personSchema 使用 uniqueValidator
personSchema.plugin(uniqueValidator)

// 重写 toJSON
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// 导出
module.exports = mongoose.model('Person', personSchema)
