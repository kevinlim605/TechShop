import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/order';
import { addDecimals } from '../shared/addDecimals';

const PlaceOrder = ({ history }) => {
  // mapStateToProps
  const cart = useSelector((state) => state.cart);
  const orderCreate = useSelector((state) => state.orderCreate);

  const { order, success, error } = orderCreate;

  // mapDispatchToProps
  const dispatch = useDispatch();

  // Calculate prices, we need strings to display proper decimal places
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Calculate shipping, we need strings to display proper decimal places
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);

  // Calculate tax, we need strings to display proper decimal places
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));

  // Calculate total price, we need strings to display proper decimal places
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  // componentDidMount
  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
    }
    // you can grab warnings from the terminal and add them to disable warnings like below
    // eslint-disable-next-line
  }, [history, success]);

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>
                  Address: {cart.shippingAddress.address},{' '}
                  {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{' '}
                  {cart.shippingAddress.country}
                </strong>
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: {cart.paymentMethod}</strong>
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {addDecimals(item.qty * item.price)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItem === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrder;
