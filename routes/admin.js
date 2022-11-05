const express = require('express');

const {
  getAddProduct,
  getEditProduct,
  postProduct,
  editProduct,
  getProducts,
  deleteProduct,
} = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/edit-product/123456 => GET
router.get('/edit-product/:productId', getEditProduct);

// /admin/products => GET
router.get('/products', getProducts);

// /admin/add-product => POST
router.post('/add-product', postProduct);

// /admin/edit-product => POST
router.post('/edit-product', editProduct);

// /admin/delete-product => POST
router.post('/delete-product', deleteProduct);

module.exports = router;
