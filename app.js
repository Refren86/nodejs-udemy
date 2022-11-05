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
  const testUser = new User('Kimimaru', 'test@gmail.com');
  const userInDb = await User.findByEmail(testUser.email);
  req.user = userInDb;

  if (!userInDb) {
    await testUser.save();
    console.log('User created!');
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
