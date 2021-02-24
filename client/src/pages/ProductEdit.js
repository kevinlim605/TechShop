import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  fetchProductDetails,
  productUpdateReset,
  updateProduct,
  clearProductDetails,
} from '../actions/products';
import FormContainer from '../components/FormContainer';

const ProductEdit = ({ match, history }) => {
  const productId = match.params.id;

  // component level state
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  // mapDispatchToProps
  const dispatch = useDispatch();

  // mapStateToProps
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  // componentDidMount
  useEffect(() => {
    // check if there already was a successful product update
    // if so, we want to reset our productUpdate state and redirect to
    // the admin product list page
    if (successUpdate) {
      dispatch(productUpdateReset());
      dispatch(clearProductDetails());
      history.push('/admin/productlist');
    } else {
      // Otherwise, check if product does not exist or if product id does not match id from
      // url. If so, we dispatch fetchProductDetails action to get the product's details
      // from the productId from the url
      if (!product.name || product._id !== productId) {
        dispatch(fetchProductDetails(productId));
        // If the product does exist and the user's id matches the url id,
        // then we'll set the component level state with those product details
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [product, productId, dispatch, history, successUpdate]);

  const submitHandler = (e) => {
    // prevents page from refresh
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    // e.target.files will be an array of files. In our case, we are only uploading
    // one file, an image, so it will be the first item in the array
    const file = e.target.files[0];
    // initalize a FormData object. A FormData object lets you compile a set of
    // key/value pairs to send using XMLHttpRequest. It is primarily intended for use
    // in sending form data.
    const formData = new FormData();
    // FormData.append() appends a new value onto an existing key inside a
    // FormData object, or adds the key if it does not already exist.
    // We'll create a key of 'image' and set the value as the file
    formData.append('image', file);
    // we'll set the uploading component level state to true so that our loader activates
    setUploading(true);

    // We'll make our API request here
    try {
      // Create our config object here with our headers object
      const config = {
        headers: {
          // We'll send the content type as multipart/form-data because we
          // are sending a file in our post request
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer: ${userInfo.token}`,
        },
      };

      // We'll send our formData in the post request, which will send us back the
      // path in a response object which we will destructure as data
      const { data } = await axios.post('/api/upload', formData, config);
      // We'll set the image component level state to the path so that our UI will
      // show the file path of the image we just uploaded
      setImage(data);
      // Set loading to false so that the loader stops rendering after we successfully
      // uploaded our image
      setUploading(false);
    } catch (error) {
      // output an error message to the console if there is an error
      console.error(error);
      // continuously show our loader if there is an error
      setUploading(false);
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
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
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.File
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>
            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter count in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
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

export default ProductEdit;
