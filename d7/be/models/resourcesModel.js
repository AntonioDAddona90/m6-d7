const mongoose = require("mongoose");

const ResourceModelSchema = new mongoose.Schema({
  guid: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
  balance: {
    type: String,
    trim: true,
  },
  picture: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 0,
    max: 125,
    required: true,
  },
  eyeColor: {
    type: String,
    required: true,
  },
  name: {
    first: {
      type: String,
      required: true,
    },
    last: {
      type: String,
      required: true,
    },
  },
  company: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: false,
  },
  latitude: {
    type: String,
    required: false,
  },
  longitude: {
    type: String,
    required: false,
  },
  tags: {
    type: Array,
    required: true,
    default: [],
  },
  range: {
    type: Array,
    required: true,
    default: [],
  },
  friends: {
    type: Array,
    required: true,
    default: [
      {
        id: {
          type: Number,
          required: false,
        },
        name: {
          type: String,
          required: false,
        },
      },
    ],
  },
  greetings: {
    type: String,
    required: false,
  },
  favoriteFruit: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Resource", ResourceModelSchema, "resources");