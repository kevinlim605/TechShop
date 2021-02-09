import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Form,
  Card,
  Button,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, clearProductDetails } from '../actions/products';
import Rating from '../components/Rating';
import Message from '../components/Message';
import Loader from '../components/Loader';

// history and match are props passed by route. match contains the the matched path information
// and parameters in the URL. History is the history API which is used to navigate user to
// other view programatically.
const ProductPage = ({ history, match }) => {
  const [qty, setQty] = useState(1);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    dispatch(fetchProductDetails(match.params.id));

    // using a return function inside useEffect() is analogous to using componentWillUnmount() lifecycle method
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, match]);

  const addToCartHandler = () => {
    // props.history.push will redirect to the argument string url
    // we add a query string to the end of our argument string url like this
    // ex.) ?qty=2, ?qty=3, ?qty=4, etc.
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  return (
    <>
      <LinkContainer to="/" className="my-3">
        <Button variant="dark">Go Back</Button>
      </LinkContainer>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col class="product-page-section" md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col class="product-page-section" md={3}>
            <ListGroup variant="flush">
              <ListGroupItem>
                <h3>{product.name}</h3>
              </ListGroupItem>
              <ListGroupItem>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroupItem>
              <ListGroupItem>Price: {product.price}</ListGroupItem>
              <ListGroupItem>Description: {product.description}</ListGroupItem>
            </ListGroup>
          </Col>
          <Col class="product-page-section">
            <Card>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <Row>
                    <Col class="product-page-section">Price:</Col>
                    <Col class="product-page-section">
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col class="product-page-section">Status:</Col>
                    <Col class="product-page-section">
                      {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                    </Col>
                  </Row>
                </ListGroupItem>
                {/* Double ampersand is just an if statement, no else statement. */}
                {product.countInStock > 0 && (
                  <ListGroupItem>
                    <Row>
                      <Col class="product-page-section">Qty</Col>
                      <Col class="product-page-section">
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {/* Array(x) where x is a number gives us an array of x number of undefined values
                          .keys() returns an Array Iterator object that contains the keys for each index in the array
                          We use the spread operator to spread the Array Iterator object into an array of integers 
                          We map that array of integers to every integer qty leading up to countInStock. */}
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroupItem>
                )}

                <ListGroupItem>
                  <Button
                    className="btn-block"
                    type="button"
                    variant="dark"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >
                    Add To Cart
                  </Button>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductPage;
