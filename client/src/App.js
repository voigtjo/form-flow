import React, { useState, useEffect } from 'react';
import EntityForm from './EntityForm';
import EntityTable from './EntityTable';

import { Container, Typography, Grid, Button } from '@mui/material';

const App = () => {
  const [userData, setUserData] = useState({ id: null, firstName: '', lastName: '', age: '', email: '', address: '' });
  const [productData, setProductData] = useState({ id: null, name: '', price: '', description: '' });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [webComponents, setWebComponents] = useState([]);
  const [productWebComponents, setProductWebComponents] = useState([]);
  const [activeTab, setActiveTab] = useState('users');


  useEffect(() => {
    // Fetching data from REST API for users
    fetch('http://localhost:5050/users')
      .then(response => response.json())
      .then(data => {
        console.log('Data received:', data); // Log the incoming data
        setUsers(data);
    })
      .catch(error => console.error('Error fetching users:', error));

    // Fetching data from REST API for products
    fetch('http://localhost:5050/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));

    // Fetching data from webComponents.json
    fetch('/webComponents.json')
      .then(response => response.json())
      .then(data => setWebComponents(data))
      .catch(error => console.error('Error fetching data:', error));

    // Fetching data from productWebComponents.json
    fetch('/productWebComponents.json')
      .then(response => response.json())
      .then(data => setProductWebComponents(data))
      .catch(error => console.error('Error fetching product data:', error));
  }, []);


  const handleUserInputChange = (value, key) => {
    setUserData({ ...userData, [key]: value });
  };

  const handleProductInputChange = (value, key) => {
    setProductData({ ...productData, [key]: value });
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const isNewUser = userData.id === null;

    fetch(isNewUser ? 'http://localhost:5050/users' : `http://localhost:5050/users/${userData.id}`, {
      method: isNewUser ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        if (isNewUser) {
          setUsers([...users, data]);
        } else {
          const updatedUsers = [...users];
          updatedUsers[selectedUserIndex] = data;
          setUsers(updatedUsers);
          setSelectedUserIndex(null);
        }
        setUserData({ id: null, firstName: '', lastName: '', age: '', email: '', address: '' });
      })
      .catch(error => console.error('Error saving user:', error));
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const isNewProduct = productData.id === null;

    fetch(isNewProduct ? 'http://localhost:5050/products' : `http://localhost:5050/products/${productData.id}`, {
      method: isNewProduct ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    })
      .then(response => response.json())
      .then(data => {
        if (isNewProduct) {
          setProducts([...products, data]);
        } else {
          const updatedProducts = [...products];
          updatedProducts[selectedProductIndex] = data;
          setProducts(updatedProducts);
          setSelectedProductIndex(null);
        }
        setProductData({ id: null, name: '', price: '', description: '' });
      })
      .catch(error => console.error('Error saving product:', error));
  };

  const handleUserEdit = (index) => {
    setUserData(users[index]);
    setSelectedUserIndex(index);
  };

  const handleProductEdit = (index) => {
    setProductData(products[index]);
    setSelectedProductIndex(index);
  };

  const handleUserClear = () => {
    setUserData({ id: null, firstName: '', lastName: '', age: '', email: '', address: '' });
  };

  const handleProductClear = () => {
    setProductData({ id: null, name: '', price: '', description: '' });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Container>
      <Typography variant="h2" align="center">Form Flow</Typography>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Button onClick={() => handleTabChange('users')} variant={activeTab === 'users' ? 'contained' : 'outlined'} color="primary">User Form</Button>
          <Button onClick={() => handleTabChange('products')} variant={activeTab === 'products' ? 'contained' : 'outlined'} color="primary">Product Form</Button>
        </Grid>
        <Grid item xs={9}>
          {activeTab === 'users' ? (
            <EntityForm
              id={userData.id}
              components={webComponents}
              onInputChange={handleUserInputChange}
              onSubmit={handleUserSubmit}
              onClear={handleUserClear}
              data={userData}
              name="user"
            />
          ) : (
            <EntityForm
              id={productData.id}
              components={productWebComponents}
              onInputChange={handleProductInputChange}
              onSubmit={handleProductSubmit}
              onClear={handleProductClear}
              data={productData}
              name="product"
            />
          )}
          {activeTab === 'users' ? (
            <EntityTable entities={users} onEdit={handleUserEdit} tableColumns={webComponents} name="user"/>
          ) : (
            <EntityTable entities={products} onEdit={handleProductEdit} tableColumns={productWebComponents} name="product"/>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
