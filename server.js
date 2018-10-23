const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

// mongo
const User = require('./model/User');
const Coin = require('./model/Coin');
const mongoose = require('mongoose');
mongoose.set('debug', true);
const uri = `mongodb://${encodeURIComponent('cryptoryadmin')}:${encodeURIComponent('cryptory123456789')}@ds247569.mlab.com:47569/heroku_d783vzs7`
mongoose.connect(uri);
// logging
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// passport
const passport = require('passport');
const githubStrategy = require('./server/github-signup');
passport.use(githubStrategy);
passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (user, cb) {
  User.findById(user._id, function (err, user) {
    cb(null, user);
  });
});

// express
const app = express();
// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('dist'));
app.use(helmet());
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('express-session')({secret: 'keyboard cat', resave: true, saveUninitialized: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function (req, res) {
    if (!req.user) {
      res.render('home');
    } else {
      res.redirect('profile')
    }
  });

app.get('/login',
  function (req, res) {
    res.render('home');
  });

app.get('/logout',
  function (req, res) {
    req.logout();
    res.redirect('/')
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    res.render('profile', {user: req.user.username});
  });

app.get('/login/github',
  passport.authenticate('github'));

app.get('/login/github/return',
  passport.authenticate('github', {failureRedirect: '/login'}),
  function (req, res) {
    res.redirect('/profile');
  });

app.get('/home/:id',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    let username;
    try {
      username = req.params.username
      console.error('username: ', username)
    } catch (error) {
      res.status(422).json({message: 'invalid username. ' + error})
      return;
    }
    res.render('home', {user: req.user.id});
  });

app.get('/api/user/:id', (req, res) => {
  require('connect-ensure-login').ensureLoggedIn(),
    User.findOne({username: JSON.parse(req.params.username)},
      function (err, obj) {
        if (err) {
          res.send(err);
          return;
        }
        res.json({data: obj});
      });
});

app.get('/api/coin', (req, res) => {
  require('connect-ensure-login').ensureLoggedIn(),
    Coin.findOne({name: 'coins'},
      function (err, obj) {
        if (err) {
          res.send(err);
          return;
        }
        res.json({info: obj});
      });

});

// call API every 30 seconds
const loadCurrencyData = require('./server/currency_api.js');
loadCurrencyData();

const port = process.env.PORT || 3000

// Serve the files on port 3000.
app.listen(port, function () {
  console.log('Example app listening on port 3000!\n');
});

