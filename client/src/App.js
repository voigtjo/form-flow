import React, { useState, useEffect } from 'react';
import EntityForm from './EntityForm';
import EntityTable from './EntityTable';
import { Container, Typography, Grid, Button } from '@mui/material';

const BASE_URL = 'http://localhost:5050';

const App = () => {
  const [userData, setUserData] = useState({});
  const [productData, setProductData] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [webComponents, setWebComponents] = useState([]);
  const [productWebComponents, setProductWebComponents] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    if (activeTab === 'users') {
      // Fetching data from REST API for users
      fetch(`${BASE_URL}/users`)
        .then(response => response.json())
        .then(data => {
          console.log('Data received:', data); // Log the incoming data
          setUsers(data);
        })
        .catch(error => console.error('Error fetching users:', error));
        
      // Fetching data from users.json
      fetch('/users.json')
        .then(response => response.json())
        .then(data => {
          setWebComponents(data);
          initializeUserData(data);
        })
        .catch(error => console.error('Error fetching user-masterdata:', error));
    } else if (activeTab === 'products') {
      // Fetching data from REST API for products
      fetch(`${BASE_URL}/products`)
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching product-masterdata:', error));

      // Fetching data from products.json
      fetch('/products.json')
        .then(response => response.json())
        .then(data => {
          setProductWebComponents(data);
          initializeProductData(data);
        })
        .catch(error => console.error('Error fetching product data:', error));
    }
  }, [activeTab]);

  const initializeUserData = (data) => {
    const initialUserData = data.reduce((acc, curr) => {
      acc[curr.props.id] = '';
      return acc;
    }, { id: null });
    setUserData(initialUserData);
  };

  const initializeProductData = (data) => {
    const initialProductData = data.reduce((acc, curr) => {
      acc[curr.props.id] = '';
      return acc;
    }, { id: null });
    setProductData(initialProductData);
  };


  const handleUserInputChange = (value, key) => {
    setUserData({ ...userData, [key]: value });
  };

  const handleProductInputChange = (value, key) => {
    setProductData({ ...productData, [key]: value });
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const isNewUser = userData.id === null;
  
    fetch(isNewUser ? `${BASE_URL}/users` :`${BASE_URL}/users/${userData.id}`, {
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
        // Initialize userData with values from webComponents.json
        const initialUserData = webComponents.reduce((acc, curr) => {
          acc[curr.props.id] = '';
          return acc;
        }, { id: null });
        setUserData(initialUserData);
      })
      .catch(error => console.error('Error saving user:', error));
  };
  

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const isNewProduct = productData.id === null;
  
    fetch(isNewProduct ? `${BASE_URL}/products` : `${BASE_URL}/products/${productData.id}`, {
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
        // Initialize productData with values from productWebComponents.json
        const initialProductData = productWebComponents.reduce((acc, curr) => {
          acc[curr.props.id] = '';
          return acc;
        }, { id: null });
        setProductData(initialProductData);
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
    // Initialize userData with values from webComponents.json
    const initialUserData = webComponents.reduce((acc, curr) => {
      acc[curr.props.id] = '';
      return acc;
    }, { id: null });
    setUserData(initialUserData);
  };
  

  const handleProductClear = () => {
    // Initialize productData with values from productWebComponents.json
    const initialProductData = productWebComponents.reduce((acc, curr) => {
      acc[curr.props.id] = '';
      return acc;
    }, { id: null });
    setProductData(initialProductData);
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