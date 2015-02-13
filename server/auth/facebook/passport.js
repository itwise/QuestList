var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var FB = require('fb');


exports.setup = function (User, config) {
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'facebook.id': profile.id
      },
      function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {

          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            username: profile.username,
            provider: 'facebook',
            profileImage: 'http://graph.facebook.com/'+ profile.id +'/picture',
            facebook: profile._json
          });
          user.save(function(err) {
            if (err) done(err);
            return done(err, user);
          });
        } else {
        /*  FB.setAccessToken(accessToken);
          FB.api(
            "/"+ profile.id +"/friends",
            function (response) {
              console.log(response);
              if (response && !response.error) {
                *//* handle the result *//*
              }
            }
          );*/
          return done(err, user);
        }
      })
    }
  ));
};
