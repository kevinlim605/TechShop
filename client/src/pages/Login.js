import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { login } from '../actions/user';
import FormContainer from '../components/FormContainer';

const Login = ({ history, location }) => {
  // component level state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // mapDispatchToProps
  const dispatch = useDispatch();

  // mapStateToProps
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  // componentDidMount
  useEffect(() => {
    // We will redirect if we're already logged in. We don't want to go to the login screen if
    // we're logged in. So we'll check if there is user info, and if there is that means a user
    // is logged in, so we'll use history.push to redirect. We defined this in our useEffect, so
    // it will automatically check the moment we load the login page
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    // prevents page from refresh
    e.preventDefault();
    // Dispatch Login
    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="dark">
          Sign In
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : 'register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default Login;