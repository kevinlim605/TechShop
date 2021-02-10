import axios from 'axios';
import * as ActionTypes from '../actiontypes/cart';

// id and qty we can get from the url
// getState allows us to get our entire state tree (ex. productList, productDetails, etc.)
// to get those pieces of state, you simply call getState.productList for example
export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch(cartAddItem(data, qty));

  // We want to save it in local storage soe we use the localStorage API and use the .setItem() method
  // first argument is a string containing the title of what we want to save the second argument in the
  // local storage as. In this case, we are saving the JSON string and titling it as 'cartItems'
  // Also, we have to use JSON.stringify because we can only save JSON strings in local storage
  // To take it out from local storage, we will have to use JSON.parse()
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch(cartRemoveItem(id));

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const cartAddItem = (data, qty) => ({
  type: ActionTypes.CART_ADD_ITEM,
  payload: {
    // data will be passed in from the addToCart action
    product: data._id,
    name: data.name,
    image: data.image,
    price: data.price,
    countInStock: data.countInStock,
    // qty will be what we passed in at the top,
    // hence we can write shorthand (it will be passed in from addToCart action)
    qty,
  },
});

export const cartRemoveItem = (id) => ({
  type: ActionTypes.CART_REMOVE_ITEM,
  payload: id,
});
