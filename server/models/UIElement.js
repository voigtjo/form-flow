const mongoose = require('mongoose');

const UIElementSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  props: {
    type: Object,
    required: true
  },
  entity: {
    type: String,
    required: true
  }
});

const UIElement = mongoose.model('UIElement', UIElementSchema);

module.exports = UIElement;

