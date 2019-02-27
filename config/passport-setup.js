const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user');


//passport method takes a user by the user id (taken from mongo)
// Creates a cookie for a user
passport.serializeUser((user, done) => {
  //if there is an error then output null otherwise store id into a cookie
  done(null, user.id);
});

//Take the id from the cookie and get the user information
passport.deserializeUser((id, done) => {
  //get user based on id from cookie
  User.findById(id).then((user) => {
    //call back function to retrieve user
    done(null, user);
  })
});

passport.use(
  new GoogleStrategy({
  callbackURL: '/auth/google/redirect',
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret
},(accessToken, refreshToken, profile, done) => {
  //check is user already exists by googleid

  User.findOne({googleId: profile.id}).then((currentUser) => {
    if(currentUser){

      //Already have a user
      console.log('user is:' + currentUser);
      //if we have a current user then execute done
      // and pass in the current user
      // no error so null is the error
      done(null, currentUser);
    }else {
        console.log(profile);

      //if no user then create user in db based on information retrieved from google
      new User({
        username: profile.displayName,
        googleId: profile.id,
        thumbnail: profile._json.image.url

        //Saves new user into the database
      }).save().then((newUser) => {
        console.log('new user created' + newUser);
        done(null, newUser);
      });
    }
  });


})
)
