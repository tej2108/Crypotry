const mongoose = require('mongoose')

//User needs data about former transactions, (maybe) preferred local currency 
//and currently held cryptocurrencies (type and amount). Should that go in here or somewhere else?

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ''},
  someId: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    default: '',
    required: true,
    // unique: true
  },
  email: {
    type: String,
    default: '',
    required: true,
    // unique: true
  },
  password: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: ''
  },
  following: {
    type: Array,
    default: ''
  },
  github: String,
  profile: {
    name: {type: String, default: ''},
    gender: {type: String, default: ''},
    location: {type: String, default: ''},
    website: {type: String, default: ''},
    picture: {type: String, default: ''}
  },
});

module.exports = mongoose.model('User', userSchema)

