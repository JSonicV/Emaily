const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const { googleClientID, googleClientSecret } = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(
    new GoogleStrategy({
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ googleId: profile.id });
        if (!user) {
            new User({ googleId: profile.id }).save()
                .then(user => done(null, user))
                .catch(err => console.log(err));
        } else {
            done(null, user);
        }
    })
);

module.exports = passport;