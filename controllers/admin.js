const Product = require('../models/product');
const user = require('../models/user');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
  .createProduct({
    title:title,
    imageUrl:imageUrl,
    price:price,
    description:description
  })
  .then(result=>{
    res.redirect('/')
  })
  .catch(err=>console.log(err));
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({where:{id:prodId}})
  //Product.findByPk(prodId)
  .then(products => {
    const product = products[0]
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
  .catch(err =>console.log(err));
  
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
  .then(product=>{
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;
    
    return product.save();
  })
  .then(result=>{
    console.log('updated')
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(product=>{
    res.render('admin/products', {
      prods: product,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err=>
    console.log(err)
); 
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
  .then(product=>{
    product.destroy();
    res.redirect('/admin/products');
  })
  .then(result=>{
    console.log('deleted')
  })
  .catch(err=>console.log(err));
 
};
