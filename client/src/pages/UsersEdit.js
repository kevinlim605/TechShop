import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUser, userUpdateReset } from '../actions/user';
import FormContainer from '../components/FormContainer';

const UsersEdit = ({ match, history }) => {
  const userId = match.params.id;

  // component level state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // mapDispatchToProps
  const dispatch = useDispatch();

  // mapStateToProps
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  // componentDidMount
  useEffect(() => {
    // check if user was updated (if successUpdate is true), if so, we want to reset
    // the userUpdate state and then redirect to the user list
    if (successUpdate) {
      dispatch(userUpdateReset());
      history.push('/admin/userlist');
      // otherwise continue with the update user functionality
    } else {
      // check if user does not exist or if user id does not match id from url
      // if so, we dispatch getUserDetails action to get the user's details from
      // the userId from the url
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
        // If the user does exist and the user's id matches the url id,
        // then we'll set the component level state with those details
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [user, userId, dispatch, successUpdate, history]);

  const submitHandler = (e) => {
    // prevents page from refresh
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="isAdmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                disabled={userInfo._id === userId}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>
            <Button type="submit" variant="dark">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UsersEdit;
