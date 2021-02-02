import React from 'react';
import { Container } from 'react-bootstrap';
import { Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from '../pages/Home';
import Product from '../pages/Product';

const Main = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Route exact path="/" component={Home} />
          <Route path="/products/:id" component={Product} />
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default Main;
