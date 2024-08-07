const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Attribute = require('./models/Attribute'); // Import the Attribute model
const UIElement = require('./models/UIElement'); // Import the UIElement model
const auth = require('./middleware/auth'); // Import the authentication middleware
const authRoutes = require('./routes/auth'); // Import the authentication routes

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(bodyParser.json());

const URI = process.env.ATLAS_URI || "";
console.log("URI:" + URI);

mongoose.connect(URI, {
  dbName: 'testapp',
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

async function reconnectDatabase() {
  try {
      // Disconnect if already connected
      await mongoose.disconnect();
      // Reconnect to MongoDB
      await mongoose.connect(URI, {
          dbName: 'employees',
          useNewUrlParser: true,
          useUnifiedTopology: true
      });
      console.log('Reconnected to MongoDB successfully:', dbName);
  } catch (error) {
      console.error('Failed to reconnect to MongoDB:', dbName , error);
      throw error;  // Rethrowing the error to handle it in the calling function
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
      //console.log("1) entity:" + entity + ", name:" + name + ", type:" + type);
      if (!mongoose.models[name.capitalize()]) { // Check if model already exists
        schemas[entity][name] = mongoose.Schema.Types[type];
      }
    }

    // Define mongoose models based on schemas
    for (const entityName in schemas) {
      const capitalizedEntityName = entityName.capitalize();
      
      if (!mongoose.models[capitalizedEntityName]) { // Check if model already exists
        //console.log("2) entityName:" + entityName + ", capitalizedEntityName:" + capitalizedEntityName);
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

// Endpoint to reinitialize schemas
app.get('/reinitialize-schemas', async (req, res) => {
  try {
    await reconnectDatabase();
    schemas = await initializeSchemas();
    const uiElements = await UIElement.find();
    res.json(uiElements);
  } catch (error) {
    console.error('Error reinitializing schemas:', error);
    res.status(500).json({ message: 'Failed to reinitialize schemas', error: error.message });
  }
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

app.post('/create-collection', auth, async (req, res) => {
  const { collectionName } = req.body; // Assume the input name is the singular form of the collection name
  const pluralize = require('pluralize');

  if (!collectionName) {
      return res.status(400).json({ message: 'Collection name is required.' });
  }

  const collectionRef = pluralize(collectionName); // Plural form of the collection name for MongoDB collection

  try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      const collectionExists = collections.some(col => col.name === collectionRef);

      if (collectionExists) {
          console.log(`db.name=${db.name}, collectionName=${collectionRef} ERROR: collection already exists`);
          return res.status(400).json({ message: 'Collection already exists.' });
      } else {
          await db.createCollection(collectionRef); // Use pluralized name for the actual MongoDB collection

          // Ensure EntityModel is your model for the 'entities' collection
          const EntityModel = mongoose.models['Entity'] || mongoose.model('Entity', new mongoose.Schema({
              name: String, // Singular form
              collection: String // Plural form used here for collection
          }));

          // Insert into entities collection
          const newEntity = new EntityModel({
              name: collectionName,
              collection: collectionRef
          });
          await newEntity.save();

          return res.status(200).json({ message: `Collection ${collectionRef} created successfully.` });
      }
  } catch (error) {
      console.error('Error creating collection:', error);
      return res.status(500).json({ message: 'Failed to create collection.', error: error.message });
  } finally {
      console.log(`db.name=${db.name}, collectionName=${collectionRef}: creation attempt finished`);
  }
});

app.get('/list-collections', auth, async (req, res) => {
  const pluralize = require('pluralize');
  try {
      // Get a list of all collections in the database
      const collections = await mongoose.connection.db.listCollections().toArray();
      
      // Extract the name of each collection, convert to singular, and return it
      const collectionNames = collections.map(collection => pluralize.singular(collection.name));
      
      res.json(collectionNames);
  } catch (error) {
      console.error('Failed to list collections:', error);
      res.status(500).json({ message: 'Failed to list collections' });
  }
});

// Route for fetching attributes by entity
app.get('/attributes/:entity', auth, async (req, res) => {
  const { entity } = req.params;

  try {
    const attributes = await Attribute.find({ entity: entity });
    if (attributes.length === 0) {
      return res.status(404).json({ message: `No attributes found for entity ${entity}` });
    }
    res.json(attributes);
  } catch (error) {
    console.error(`Error fetching attributes for entity ${entity}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Route for fetching UI elements
app.get('/ui-elements', auth, async (req, res) => {
  try {
    const uiElements = await fetchUIElements();
    res.json(uiElements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generic route for fetching entities
app.get('/:entity', auth, async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for finding a dataset by ID
app.get('/:entity/:id', auth, async (req, res) => {
  const { entity, id } = req.params;
  console.log("GET: entity:" + entity + ", id:" + id);
  try {
    if (!schemas || !schemas[entity]) {
      return res.status(404).json({ message: `Schema for ${entity} not found` });
    }
    
    const EntityModel = mongoose.models[entity.capitalize()] || mongoose.model(entity.capitalize(), new mongoose.Schema(schemas[entity]));
    const dataset = await EntityModel.findById(id);
    if (!dataset) {
      console.log("GET: dataset not found");
      return res.status(404).json({ message: `${entity.capitalize()} not found` });
    }
    console.log("RESULT GET: dataset:" + dataset);
    res.json(dataset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generic route for creating entities
app.post('/:entity', auth, async (req, res) => {
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
app.put('/:entity/:id', auth, async (req, res) => {
  const { entity, id } = req.params;
  console.log("PUT: entity:" + entity + ", id:" + id);
  console.log(req.body);
  try {
    const EntityModel = mongoose.models[entity.capitalize()] || mongoose.model(entity.capitalize(), new mongoose.Schema(schemas[entity]));
    //console.log("PUT: EntityModel:" + EntityModel + ", schemas[entity]=" + schemas[entity]);
    const updatedEntity = await EntityModel.findByIdAndUpdate(id, req.body, { new: true });
    console.log("RESULT PUT: updatedEntity:" + updatedEntity);
    if (!updatedEntity) return res.status(404).json({ message: `${entity.capitalize()} not found` });
    res.json(updatedEntity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generic route for deleting entities
app.delete('/:entity/:id', auth, async (req, res) => {
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

// Use authentication routes
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
