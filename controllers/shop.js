const Product = require('../models/product');
const Cart = require('../models/cart');

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
  Cart.getCart((cart) => {
    // find in the Products model, because I'm storing products ids in the Cart model!
    Product.getAll((products) => {
      const cartProducts = [];
      for (let product of products) {
        const productInCart = cart.products.find(
          (cartProd) => cartProd.id === product.id
        );

        if (productInCart) {
          cartProducts.push({
            productData: product,
            quantity: productInCart.quantity,
          });
        }
      }

      res.render('shop/cart', {
        products: cartProducts,
        path: '/cart',
        pageTitle: 'Your Cart',
      });
    });
  });
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

  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });

  res.redirect('/cart');
};

const removeFromCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price);
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
