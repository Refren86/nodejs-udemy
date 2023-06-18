const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const User = require('./models/user');
const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('648f1f48a58fd156d482a6f0')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://root:root@cluster0.9w8do.mongodb.net/shop?retryWrites=true',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    User.findById('648f1f48a58fd156d482a6f0').then((user) => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'test@test.com',
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
    console.log('Database connected and server started on port 3000');
  })
  .catch((err) => {
    console.log(err);
  });
