const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; // ?edit=true
  const { productId } = req.params;

  if (!editMode) {
    return res.redirect('/');
  }

  Product.findById(productId).then((product) => {
    if (!product) {
      throw new Error(`Product with id ${productId} doesn't exist!`);
    }

    res.render('admin/edit-product', {
      product,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
    });
  });
};

const getProducts = (req, res, next) => {
  Product.getAll().then((products) => {
    res.render('admin/products', {
      products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
};

const postProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const product = new Product(title, price, description, imageUrl);

  product.save();

  res.redirect('/');
};

const editProduct = (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body; // productId comes from hidden input

  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    productId
  );

  product.save();

  res.redirect('/admin/products').then(() => {
    console.log('Product created!');
    res.redirect('/admin/products');
  });
};

const deleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId);

  res.redirect('/admin/products');
};

module.exports = {
  getAddProduct,
  getEditProduct,
  getProducts,
  postProduct,
  editProduct,
  deleteProduct,
};
