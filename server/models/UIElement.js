const mongoose = require('mongoose');

// Define a schema for UI elements
const UIElementSchema = new mongoose.Schema({
  label: String,
  type: {
    type: String,
    enum: ['number', 'string', 'boolean', 'date', 'datetime-local', 'email', 'month', 'password', 'search', 'tel', 'time', 'url', 'week'],
    default: 'string'
  },
  entity: String,
  entityid: String,
  x_pos: Number,
  y_pos: Number
});

// Define a model for UI elements
const UIElement = mongoose.model('UIElement', UIElementSchema);

module.exports = UIElement;
