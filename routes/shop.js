const express = require('express');

const {
  getProducts,
  getProduct,
  getCart,
  getIndex,
  getCheckout,
  getOrders,
  addToCart,
  removeFromCart,
} = require('../controllers/shop');

const router = express.Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', getCart);

router.get('/orders', getOrders);

router.get('/checkout', getCheckout);

router.post('/cart', addToCart)

router.post('/cart-delete-item', removeFromCart);

module.exports = router;
