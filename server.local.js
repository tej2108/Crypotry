const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require("webpack-hot-middleware");
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();
const fetch = require('node-fetch');

// mongo
const User = require('./model/User')
const Coin = require('./model/Coin')
const mongoose = require('mongoose')
const uri = `mongodb://${encodeURIComponent('cryptoryadmin')}:${encodeURIComponent('cryptory123456789')}@ds247569.mlab.com:47569/heroku_d783vzs7`
const db = mongoose.connect(uri);
// mongoose.connect('mongodb://localhost:27017/cryptory');
// const db = mongoose.connection
// logging
// mongoose.set('debug', true);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// webpack
const config = require('./webpack.config.js');
const compiler = webpack(config);

// passport
const passport = require('passport');
const githubStrategy = require('./server/github-signup')
passport.use(githubStrategy)

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

app.use(helmet());
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')('alcovewonderwhy99save'));
// app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({
  secret: 'keyboardcatanalyze',
  resave: true,
  key: 'omaha',
  saveUninitialized: true,
  secure: true,
  proxy: true,
  maxAge: 54000000
}));
app.use(bodyParser.json())
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
  },)

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    // console.log('\n\n\nprofile call API', req.user, '\n\n\n')
    res.render('profile', {user: req.user.username});
  });

app.get('/login/github',
  passport.authenticate('github'));

app.get('/login/github/return',
  passport.authenticate('github', {failureRedirect: '/login'}),
  function (req, res) {
    res.redirect('/profile');
  });

// app.get('/profile', function(req, res, next) {
//   if (!req.user || (req.user.id != req.params.id)) {
//     return next('Not found');
//   }
//   res.render('/profile');
// });
app.get('/api/user/:username', (req, res) => {
  require('connect-ensure-login').ensureLoggedIn(),
    console.log('\n\n\n\n\napi user call', req.params, '\n\n\n'),
    User.findOne({username: JSON.parse(req.params.username)},
      function (err, obj) {
        if (err) {
          res.send(err);
          return;
        }
        console.log({data: obj})
        res.json({data: obj});
      });
});


// api = express.Router()


// app.post("/update", function (req, res) {
//   console.error("req", req.body)
//   require('connect-ensure-login').ensureLoggedIn(),
//     User.findOne(req.body.id, {name: req.body.name},
//       function (err) {
//         if (err) {
//           res.send(err);
//           return;
//         }
//         res.send({data: "Record has been Updated..!!"});
//       });
// })

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

// app.get('/api/user/:id', async function (ctx) {
// console.log('here')
// // Find Todo based on id, then toggle done on/off
// // const id = ctx.params.id
// const profile = await User.find({})
// // coin.done = !coin.done
// ctx.body = profile
//   console.log(ctx.body)

// Update todo in database
// const updatedCoin = await coin.save()
// ctx.body = updatedCoin


// (req, res) => {
// require('connect-ensure-login').ensureLoggedIn()
// console.error('req', req.id)
// User.findOne(req.id,
//   function (err, obj) {
//     if (err) {
//       res.send(err);
//       return;
//     }
//     // res.json(res)
//     res.json({data: obj});
//   });
// res.json(res)
// db.collection('issues').find().toArray().then(issues => {
//   const metadata = {total_count: issues.length};
//   res.json({_metadata: metadata, records: issues})
// }).catch(error => {
//   console.log(error);
//   res.status(500).json({message: `Internal Server Error: ${error}`});
// });
// })
// ;

app.get('/api/coin', (req, res) => {
  require('connect-ensure-login').ensureLoggedIn(),
    // console.error('req', req.id)
    Coin.findOne({name: 'coins'},
      function (err, obj) {
        if (err) {
          res.send(err);
          return;
        }
        // res.json(res)
        res.json({info: obj});
      });

});
// app.get('/api/profile', function(req, res) {
//   User.find({}).then(eachOne => {
//     res.json(eachOne);
//   })
// })

// app.post('profile',
//   require('connect-ensure-login').ensureLoggedIn(),
//   function (req, res) {
//     User.findByIdAndUpdate(req.user.id, {
//       $set: {
//         name: req.body.name,
//         address: req.body.address,
//         position: req.body.position,
//         salary: req.body.salary
//       }
//     }, {new: true}, function (err, employee) {
//       if (err) {
//         console.log(err);
//         res.render("../views/employees/edit", {employee: req.body});
//       }
//       res.redirect("/profile/" + employee._id);
//     })
//   }
// );


// app.use('/dist', serveStatic(config.output.publicPath))
// //   .use('/static', serveStatic('static', __dirname + '/dist/static'));
// //
// app.get('*', (req, res) => {
//   res
//     .status(200)
//     .render('index', '/dist',
//     );
// });

// const feed = require('./server/feed');

const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);

const io = socketIo(server);

let interval;
io.on('connection', socket => {
  console.log('User connected. Socket id %s', socket.id);
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => currencyAPI(socket), 5000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// io.on("connection", socket => {
//   console.log("New client connected"), setInterval(
//     () => getApiAndEmit(socket),
//     10000
//   );
//   socket.on("disconnect", () => console.log("Client disconnected"));
// });



const currencyAPI = require('./server/currency_api')

// let port = 4000
const coinPort = 4001
server.listen(coinPort, () => console.log(`Ticker listening on port ${coinPort}`));


// // // feed.start(function (room, type, message) {
// //   io.to(room).emit(type, message);
// });

// updating every 30 seconds
// const loadCurrencyData = require('./server/currency_api.js');
// loadCurrencyData();

// development
// Tell express to use the webpack-dev-middleware
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// hot reload
app.use(webpackHotMiddleware(compiler));

const port = process.env.PORT || 3000

app.listen(port, function () {
  console.log('Cryptory listening on port 3000!\n');
});


