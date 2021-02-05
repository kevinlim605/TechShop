import React from 'react';
import { Container } from 'react-bootstrap';
import { Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HomePage from '../pages/Home';
import ProductPage from '../pages/Product';

const Main = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Route exact path="/" component={HomePage} />
          <Route path="/products/:id" component={ProductPage} />
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default Main;
