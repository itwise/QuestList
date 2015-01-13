var passport = require('passport');
var KakaoStragegy = require('passport-kakao').Strategy;

exports.setup = function (User, config) {
  passport.use(new KakaoStragegy({
      clientID: config.kakao.clientID,
      callbackURL: config.kakao.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'kakao.properties.id': profile.id
      },
      function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            name: profile.username,
            //email: profile.emails[0].value,
            role: 'user',
            username: profile.username,
            provider: 'kakao',
            profileImage: profile._json.properties.thumbnail_image,
            kakao: profile._json
          });
          user.save(function(err) {
            if (err) done(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      })
    }
  ));
};
