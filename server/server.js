const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Attribute = require('./models/Attribute'); // Import the Attribute model
const UIElement = require('./models/UIElement'); // Import the UIElement model

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(bodyParser.json());

const URI = process.env.ATLAS_URI || "";
console.log("URI:" + URI);

mongoose.connect(URI, {
  dbName: 'employees',
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Function to capitalize the first letter of a string
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

// Fetch attributes from MongoDB
async function fetchAttributes() {
  try {
    const attributes = await Attribute.find();
    return attributes;
  } catch (error) {
    console.error('Error fetching attributes:', error);
    throw error;
  }
}

// Initialize schemas dynamically based on attributes fetched from MongoDB
async function initializeSchemas() {
  try {
    const fetchedAttributes = await fetchAttributes();
    const schemas = {};

    // Iterate over fetched attributes to define schemas
    for (const attribute of fetchedAttributes) {
      const { entity, name, type } = attribute;
      if (!schemas[entity]) {
        schemas[entity] = {};
      }
      if (!mongoose.models[name.capitalize()]) { // Check if model already exists
        schemas[entity][name] = mongoose.Schema.Types[type];
      }
    }

    // Define mongoose models based on schemas
    for (const entityName in schemas) {
      const capitalizedEntityName = entityName.capitalize();
      if (!mongoose.models[capitalizedEntityName]) { // Check if model already exists
        mongoose.model(capitalizedEntityName, new mongoose.Schema(schemas[entityName]));
      }
    }

    return schemas;
  } catch (error) {
    console.error('Error initializing schemas:', error);
    throw error;
  }
}

// Initialize schemas on server start
let schemas;
initializeSchemas()
  .then((initializedSchemas) => {
    schemas = initializedSchemas;
  })
  .catch((error) => {
    console.error('Failed to initialize schemas:', error);
    process.exit(1);
  });

// Fetch UI elements from MongoDB
async function fetchUIElements() {
  try {
    const uiElements = await UIElement.find();
    return uiElements;
  } catch (error) {
    console.error('Error fetching UI elements:', error);
    throw error;
  }
}

// Route for fetching UI elements
app.get('/ui-elements', async (req, res) => {
  try {
    const uiElements = await fetchUIElements();
    res.json(uiElements);
    console.log('Fetched UI elements:', uiElements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Generic route for fetching entities
app.get('/:entity', async (req, res) => {
  const { entity } = req.params;
  try {
    if (!schemas || !schemas[entity]) {
      return res.status(404).json({ message: `Schema for ${entity} not found` });
    }
    
    const EntityModel = mongoose.models[entity.capitalize()] || mongoose.model(entity.capitalize(), new mongoose.Schema(schemas[entity]));
    const entities = await EntityModel.find();
    const entitiesWithIdToString = entities.map(ent => ({
      ...ent.toObject(),
      id: ent._id.toString()
    }));
    res.json(entitiesWithIdToString);
    console.log(`Fetched ${entity}s:`, entitiesWithIdToString);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for finding a dataset by ID
app.get('/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  try {
    if (!schemas || !schemas[entity]) {
      return res.status(404).json({ message: `Schema for ${entity} not found` });
    }
    
    const EntityModel = mongoose.models[entity.capitalize()] || mongoose.model(entity.capitalize(), new mongoose.Schema(schemas[entity]));
    const dataset = await EntityModel.findById(id);
    if (!dataset) return res.status(404).json({ message: `${entity.capitalize()} not found` });
    
    res.json(dataset);
    console.log(`Found ${entity} by ID ${id}:`, dataset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generic route for creating entities
app.post('/:entity', async (req, res) => {
  const { entity } = req.params;
  try {
    const EntityModel = mongoose.models[entity.capitalize()] || mongoose.model(entity.capitalize(), new mongoose.Schema(schemas[entity]));
    const newEntity = new EntityModel(req.body);
    await newEntity.save();
    res.status(201).json(newEntity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generic route for updating entities
app.put('/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  try {
    const EntityModel = mongoose.models[entity.capitalize()] || mongoose.model(entity.capitalize(), new mongoose.Schema(schemas[entity]));
    const updatedEntity = await EntityModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedEntity) return res.status(404).json({ message: `${entity.capitalize()} not found` });
    res.json(updatedEntity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generic route for deleting entities
app.delete('/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  try {
    const EntityModel = mongoose.models[entity.capitalize()] || mongoose.model(entity.capitalize(), new mongoose.Schema(schemas[entity]));
    const deletedEntity = await EntityModel.findByIdAndDelete(id);
    if (!deletedEntity) return res.status(404).json({ message: `${entity.capitalize()} not found` });
    res.json({ message: `${entity.capitalize()} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
