const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // { items: [] }
    this._id = id;
  }

  save() {
    const db = getDb();

    return db
      .collection('users')
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(userId) {
    const db = getDb();

    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findByEmail(email) {
    const db = getDb();

    return db
      .collection('users')
      .findOne({ email: email })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getCart() {
    // cart has ids of products, so populate products and return
    const db = getDb();
    const productIds = this.cart.items.map((prod) => prod.productId); // array of { productId, quantity}

    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        // getting all products from db and adding qty to each product based on suer's cart
        return products.map((prod) => {
          return {
            productData: prod,
            quantity: this.cart.items.find(
              (item) => item.productId.toString() === prod._id.toString()
            ).quantity,
          };
        });
      });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      (prod) => prod.productId.toString() === product._id.toString()
    ); // searches for product inside user's cart
    let newQuantity = 1;
    const cartItems = [...this.cart.items];
    // if product already in the cart
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1; // increasing qty of existing product in cart
      cartItems[cartProductIndex].quantity = newQuantity;
    } else {
      cartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = { items: cartItems };
    const db = getDb();

    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  removeFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    const updatedCart = { items: updatedCartItems };
    const db = getDb();

    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }
}

module.exports = User;
