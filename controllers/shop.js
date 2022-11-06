const Product = require('../models/product');

const getIndex = (req, res, next) => {
  Product.getAll().then((products) => {
    res.render('shop/index', { products, pageTitle: 'Home', path: '/' });
  });
};

const getProducts = (req, res, next) => {
  Product.getAll().then((products) => {
    res.render('shop/product-list', {
      products,
      pageTitle: 'All Products',
      path: '/products',
    });
  });
};

const getProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.findById(productId).then((product) => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products',
    });
  });
};

const getCart = (req, res, next) => {
  req.user.getCart().then((cartProducts) => {
    res.render('shop/cart', {
      products: cartProducts,
      path: '/cart',
      pageTitle: 'Your Cart',
    });
  })
};

const getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};

const getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};

const addToCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log('Product added', result);
      res.redirect('/cart');
    });
};

const removeFromCart = (req, res, next) => {
  const { productId } = req.body;

  req.user.removeFromCart(productId).then(() => {
    console.log('Successfully deleted!');
    res.redirect('/cart');
  })
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  getOrders,
  getCheckout,
  addToCart,
  removeFromCart,
};
