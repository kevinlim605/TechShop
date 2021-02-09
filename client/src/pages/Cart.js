import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cart';

// location is another route prop. It is an object which represents where the app is now,
// or where you want it to go, or even where it was. It contains keys: key, pathname, search,
// hash, and state.
const Cart = ({ match, location, history }) => {
  // we will get productId from url. In the case we route to cart page from the home page and not
  // from the addToCart handler from the product page, we will not have a productId.
  const productId = match.params.id;

  // we will grab the qty from the url as well. We will check to see if there is a query string
  // from the url by using the route prop: location, and using location.search() method to see
  // if the query string exists. If it does, it will look like something like this '?qty=1'. We
  // want the numerical value at the end of the string, so we simply use some string methods to
  // manipulate the string that we want. We use the + operator to turn the string into a number.
  // If the query string doesn't exist, we'll just return 1
  const qty = location.search ? +location.search.split('=')[1] : 1;

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // we only want to dispatch our addToCart action if we have a productId created above. Remember,
  // we won't have a productId if we access the Cart page from the home screen.
  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message variant="info">
            Your Cart Is Empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroupItem key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(addToCart(item.product, +e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Col>
                </Row>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroupItem>
            <ListGroupItem>
              <Button
                type="button"
                className="btn-block"
                variant="dark"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default Cart;
