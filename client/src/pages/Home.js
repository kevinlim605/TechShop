import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import Product from '../components/Product';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);

  // useEffect() hook is the equivalent of componentDidMount() life cycle method. It takes a function as a parameter.
  // inside the function we create a async await function where we fetched from the server which returns a promise which either resolves as a response object or an error object.
  // we can access the data inside the res object by using res.data or we can destructure that response (res) as { data } and we store it inside our state.
  // lastly we simply call the async function we created outside the function, fetchProducts()
  // Also, to use the useEffect() hook, it also required a second argument, an array, that contains optional dependencies, but we will leave it empty.
  // We also get an error 404 message in the console because we did not specify the url in the axios.get() method, so it's currently looking at the url of the client which is
  // localhost:3000/api/products, but we want it to get from localhost:3443/api/products, our server. But if we did define it like that, we would still get a CORS, cross domain error. So, we
  // have to create a proxy line in our package.json file. The proxy will, instead of looking at localhost:3000, look at localhost:5000
  // we use the line   "proxy": "http://127.0.0.1:3443", where http://127.0.0.1 is our loopback address (local host) and then 3443 is our server.

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
