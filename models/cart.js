const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const storagePath = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // fetch prev cart
    fs.readFile(storagePath, (err, data) => {
      let cart = { products: [], totalPrice: 0 }; // new cart

      if (!err) {
        cart = JSON.parse(data); // existing cart
      }

      // check the cart => find the existing product
      const existingProductIndex = cart.products.findIndex((prod) => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      
      let updatedProduct;

      if (existingProduct) {
        // if product is already in the cart, increase quantity
        updatedProduct = {
          ...existingProduct,
          quantity: existingProduct.quantity + 1,
        };
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // create new product in cart
        updatedProduct = { id: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = cart.totalPrice + Number(productPrice);

      fs.writeFile(storagePath, JSON.stringify(cart), (err) => {
        console.log(err);
      })
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(storagePath, (err, data) => {
      if (err) return;

      const cart = JSON.parse(data);
      const updatedCart = { ...cart };
      // find how many specific products are in the cart
      const product = updatedCart.products.find(prod => prod.id === id);

      if (!product) return;

      const productQty = product.quantity;
      // deletes products from the cart
      updatedCart.products = updatedCart.products.filter((prod) => prod.id !== id);
      // update total price after deleting products
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(storagePath, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      })
    })
  }

  static getCart(cb) {
    fs.readFile(storagePath, (err, cart) => {
      if (err) {
        console.log(err);
        return cb(null); // cart = null
      }

      return cb(JSON.parse(cart));
    });
  }
}