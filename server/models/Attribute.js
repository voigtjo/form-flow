const mongoose = require('mongoose');

// Define a schema for attribute definitions
const AttributeSchema = new mongoose.Schema({
  name: String,
  type: String,
  entity: String,
  ref:String
});

// Define a model for attribute definitions
const Attribute = mongoose.model('Attribute', AttributeSchema);

module.exports = Attribute;
