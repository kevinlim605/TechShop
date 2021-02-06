import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { fetchProductList } from '../actions/products';

const HomePage = () => {
  // useDispatch is used to call an action, similar to mapDispatchToProps lifecycle method
  const dispatch = useDispatch();

  // useSelector is used to to select parts of the state, similar to mapStateToProps lifecycle method
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  // useEffect is used similar to componentDidMount lifecycle method
  useEffect(() => {
    dispatch(fetchProductList());
  }, [dispatch]); // must pass dispatch as a dependency as the second argument of useEffect in order to use useDispatch()

  return (
    <>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
      {/* <Row>
        {products.map((product) => (
          <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
            <Product product={product} />
          </Col>
        ))}
      </Row> */}
    </>
  );
};

export default HomePage;
