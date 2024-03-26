const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const attributes = require('./attributes.json');

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

// Define schemas dynamically based on attributes
const schemas = {};
for (const entityName of ['user', 'product']) {
  const schemaDefinition = {};
  for (const attribute of attributes[`${entityName}Attributes`]) {
    schemaDefinition[attribute.name] = mongoose.Schema.Types[attribute.type];
  }
  const capitalizedEntityName = entityName.capitalize();
  schemas[entityName] = mongoose.model(capitalizedEntityName, new mongoose.Schema(schemaDefinition));
}

// Generic route for fetching entities
app.get('/:entity', async (req, res) => {
  const { entity } = req.params;
  try {
    const entities = await schemas[entity].find();
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

// Generic route for creating entities
app.post('/:entity', async (req, res) => {
  const { entity } = req.params;
  const entityModel = schemas[entity];
  const entityObj = {};
  for (const attr of attributes[`${entity}Attributes`]) {
    if (req.body[attr.name]) {
      entityObj[attr.name] = req.body[attr.name];
    }
  }

  const newEntity = new entityModel(entityObj);
  try {
    const savedEntity = await newEntity.save();
    const savedEntityToString = {
      ...savedEntity.toObject(),
      id: savedEntity._id.toString()
    };
    res.status(201).json(savedEntityToString);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generic route for updating entities
app.put('/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  const entityModel = schemas[entity];
  try {
    const existingEntity = await entityModel.findById(id);
    if (!existingEntity) return res.status(404).json({ message: `${entity.capitalize()} not found` });

    const updatedEntityObj = {};
    for (const attr of attributes[`${entity}Attributes`]) {
      if (req.body[attr.name]) {
        updatedEntityObj[attr.name] = req.body[attr.name];
      }
    }

    Object.assign(existingEntity, updatedEntityObj);
    const updatedEntity = await existingEntity.save();
    const updatedEntityToString = {
      ...updatedEntity.toObject(),
      id: updatedEntity._id.toString()
    };
    res.json(updatedEntityToString);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generic route for deleting entities
app.delete('/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  const entityModel = schemas[entity];
  try {
    await entityModel.findByIdAndDelete(id);
    res.json({ message: `${entity.capitalize()} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
