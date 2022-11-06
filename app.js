const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const User = require('./models/user');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const getNotFound = require('./controllers/errors');
const { connectToMongo } = require('./util/database');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  const email = 'test@gmail.com';
  const userInDb = await User.findByEmail(email);
  
  if (!userInDb) {
    const testUser = new User('Kimimaru', email);
    await testUser.save();
    console.log('User created!');
  } else {
    req.user = new User(userInDb.username, userInDb.email, userInDb.cart, userInDb._id); // allows to pass user in all requests objects with all methods
  }

  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(getNotFound);

connectToMongo(() => {
  app.listen(5000, () => {
    console.log('Started on port 5000!');
  });
});
