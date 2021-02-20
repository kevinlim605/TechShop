import React from 'react';
import { Container } from 'react-bootstrap';
import { Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HomePage from '../pages/Home';
import ProductPage from '../pages/Product';
import CartPage from '../pages/Cart';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import ProfilePage from '../pages/Profile';
import ShippingPage from '../pages/Shipping';
import PaymentPage from '../pages/Payment';
import PlaceOrderPage from '../pages/PlaceOrder';
import OrderPage from '../pages/Order';
import UserListPage from '../pages/UserList';
import UserEditPage from '../pages/UserEdit';
import ProductListPage from '../pages/ProductList';
import ProductEditPage from '../pages/ProductEdit';

const Main = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Route path="/shipping" component={ShippingPage} />
          <Route path="/payment" component={PaymentPage} />
          <Route path="/placeorder" component={PlaceOrderPage} />
          <Route path="/order/:id" component={OrderPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/products/:id" component={ProductPage} />
          {/* ? in path means optional. This is because sometimes we don't need an 
          object id to access cart (meaning we acccess cart page from home screen and not 
          // redirected from addToCart handler from a product page) */}
          <Route path="/cart/:id?" component={CartPage} />
          <Route path="/admin/userlist" component={UserListPage} />
          <Route path="/admin/user/:id/edit" component={UserEditPage} />
          <Route path="/admin/productlist" component={ProductListPage} />
          <Route path="/admin/product/:id/edit" component={ProductEditPage} />
          <Route exact path="/" component={HomePage} />
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default Main;
