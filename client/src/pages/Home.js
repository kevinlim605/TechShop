import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { fetchProductList } from '../actions/products';

const HomePage = ({ match }) => {
  const keyword = match.params.keyword;

  // we'll set pageNumber to the pageNumber in the url or 1 if not defined in the url
  const pageNumber = match.params.pageNumber || 1;

  // useDispatch is used to call an action, similar to mapDispatchToProps lifecycle method
  const dispatch = useDispatch();

  // useSelector is used to to select parts of the state, similar to mapStateToProps lifecycle method
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;

  // useEffect is used similar to componentDidMount lifecycle method
  useEffect(() => {
    dispatch(fetchProductList(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]); // must pass dispatch as a dependency as the second argument of useEffect in order to use useDispatch()

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-dark">
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col
                // fixes sizing
                className="align-items-stretch d-flex"
                sm={12}
                md={6}
                lg={4}
                xl={3}
                key={product._id}
              >
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomePage;
