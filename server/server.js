const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const app = express();
const PORT = process.env.PORT || 5050;

// Enable CORS
app.use(cors());

// Connect to MongoDB
const URI = process.env.ATLAS_URI || "";
console.log("URI:" + URI);

// Connect to MongoDB
mongoose.connect(URI, {
  dbName: 'employees',
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define User schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  address: String,
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());

// Routes
// Routes
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    // Convert ObjectId to string for _id field
    const usersWithIdToString = users.map(user => ({
      ...user.toObject(),
      id: user._id.toString() // Rename _id to id
    }));
    res.json(usersWithIdToString);
    console.log("get users:");
    console.log(usersWithIdToString);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/users', async (req, res) => {
  console.log("post user:");
  console.log(req.body);
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    age: req.body.age,
    email: req.body.email,
    address: req.body.address,
  });

  try {
    const newUser = await user.save();
    // Convert ObjectId to string for _id field
    const newUserToString = {
      ...newUser.toObject(),
      id: newUser._id.toString() // Rename _id to id
    };
    res.status(201).json(newUserToString);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.age = req.body.age;
    user.email = req.body.email;
    user.address = req.body.address;

    const updatedUser = await user.save();
    // Convert ObjectId to string for _id field
    const updatedUserToString = {
      ...updatedUser.toObject(),
      id: updatedUser._id.toString() // Rename _id to id
    };
    res.json(updatedUserToString);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Define Product schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
});

const Product = mongoose.model('Product', productSchema);

// Routes for Products
// Routes for Products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    // Convert ObjectId to string for _id field
    const productsWithIdToString = products.map(product => ({
      ...product.toObject(),
      id: product._id.toString() // Rename _id to id
    }));
    res.json(productsWithIdToString);
    console.log("get products:");
    console.log(productsWithIdToString);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/products', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  });

  try {
    const newProduct = await product.save();
    // Convert ObjectId to string for _id field
    const newProductToString = {
      ...newProduct.toObject(),
      id: newProduct._id.toString() // Rename _id to id
    };
    res.status(201).json(newProductToString);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;

    const updatedProduct = await product.save();
    // Convert ObjectId to string for _id field
    const updatedProductToString = {
      ...updatedProduct.toObject(),
      id: updatedProduct._id.toString() // Rename _id to id
    };
    res.json(updatedProductToString);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
