const express = require('express');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const app = express();
const passportSetUp = require('./config/passport-setup');
const mongoose = require('mongoose');
const User = require('./models/user');
const companyRoutes = require('./routes/company');
const adminRoutes = require('./routes/admin/login');
//stored all the keys in a seperate folder
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');

//body parser middle ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




app.set('view engine','ejs');

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());




// setiing up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/company', companyRoutes);
app.use('/admin', adminRoutes);



// home route
app.get('/', (req,res) => {
  res.render('home', {user: req.user});
});


app.listen(3000, () => {
  console.log("app now listening for requests on port 3000")
});


//mongodb setup
mongoose.connect(keys.mongodb.dbURI, {useNewUrlParser: true })
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


module.exports = app;
