const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const cartItem = require('./models/cart-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    User.findByPk(1)
    .then((result)=>{
        req.user = result;
        next();
    })
    .catch(err=>console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User)
Cart.belongsToMany(Product,{through: cartItem});
Product.belongsToMany(Cart,{through:cartItem});
sequelize
.sync()
.then(result=>{
    return User.findByPk(1)
    .then((result)=>{
        if(!result){
           return User.create({name:'Vishal',email:'Vishal@test.com'})
        }
        return result;
    })
   .then(user=>{
       return user.getCart()
       .then(cart=>{
        if(!cart){
            return user.createCart();
        }
        return cart;
       })
   })
    .then((cart)=>{
        app.listen(3000);
    })
    .catch(err=>console.log(err));
})



