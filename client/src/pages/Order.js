import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder, orderPayReset } from '../actions/order';

const Order = ({ match }) => {
  // order id from url
  const orderId = match.params.id;

  // State
  const [sdkReady, setSdkReady] = useState(false);

  // mapStateToProps
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const orderPay = useSelector((state) => state.orderPay);
  // We already defined loading above so we can rename our destructured consts like this
  // So we get consts loadingPay and successPay
  const { loading: loadingPay, success: successPay } = orderPay;

  // mapDispatchToProps
  const dispatch = useDispatch();

  // Add Decimals
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  if (!loading) {
    // Calculate prices, we need strings to display proper decimal places
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  // componentDidMount
  useEffect(() => {
    const addPayPalScript = async () => {
      // destructure to get our client ID from paypal
      const { data: clientId } = await axios.get('/api/config/paypal');
      // create a script dom element
      const script = document.createElement('script');
      // give it a type attribute 'text/javascript'
      script.type = 'text/javascript';
      // give it a src attribute taken from paypal's website for sdk script plus our client ID
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      // give it an async attribute of true
      script.async = true;
      // give it an onload attribute (js function that executes immediately after page has been loaded)
      // and make that function invoke the useState function to set the sdkReady state to true.
      // (let's us know when the Software Development Kit that PayPal gives us is ready)
      script.onload = () => {
        setSdkReady(true);
      };
      // appends our script element right before the close tag of our body element
      document.body.appendChild(script);
    };

    // check if order doesn't exist or if orderId does not match the ID in the url
    // or if the pay was successful or if the pay was delivered.
    // if so, then we dispatch to get our most recent order details
    if (!order || successPay || order._id !== orderId) {
      // dispatch our orderPayReset() action so that once we pay, it will stop refreshing
      dispatch(orderPayReset());
      // dispatch getOrderDetails to fetch the most recent order
      dispatch(getOrderDetails(orderId));

      // we check if order isn't paid.
      // if so, then we'll add our paypal script
    } else if (!order.isPaid) {
      // window is a global variable, representing the window in which the script is running.
      // We can check if the paypal script is not there by using window.paypal.
      // if so, we'll add our paypal script
      if (!window.paypal) {
        addPayPalScript();
        // otherwise, we'll set the sdkReady to true
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderId, successPay, order]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>
                  Address: {order.shippingAddress.address},{' '}
                  {order.shippingAddress.city}{' '}
                  {order.shippingAddress.postalCode},{' '}
                  {order.shippingAddress.country}
                </strong>
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: {order.paymentMethod}</strong>
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Your Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${addDecimals(order.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${addDecimals(order.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${addDecimals(order.totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Order;
