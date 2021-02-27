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
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductDetails,
  clearProductDetails,
  createProductReview,
  productCreateReviewReset,
} from '../actions/products';
import Rating from '../components/Rating';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

// history and match are props passed by route. match contains the the matched path information
// and parameters in the URL. History is the history API which is used to navigate user to
// other view programatically.
const ProductPage = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    error: errorProductReview,
    success: successProductReview,
  } = productReviewCreate;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const submitHandler = (e) => {
    // prevent page from refreshing after form is submitted
    e.preventDefault();
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    );
  };

  useEffect(() => {
    // if a review has been successfully submitted, we will alert with a message
    // and set component level state back to default. We will also reset our
    // productCreate state
    if (successProductReview) {
      alert('Review Submitted!');
      setRating(0);
      setComment('');
      dispatch(productCreateReviewReset());
    }
    dispatch(fetchProductDetails(match.params.id));

    // using a return function inside useEffect() is analogous to using componentWillUnmount() lifecycle method
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, match, successProductReview]);

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
        <>
          <Meta title={product.name} />
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
                <ListGroupItem>
                  Description: {product.description}
                </ListGroupItem>
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
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
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
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {errorProductReview && (
                    <Message variant="danger">{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        >
                          {' '}
                        </Form.Control>
                      </Form.Group>
                      <Button type="submit" variant="dark">
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductPage;
