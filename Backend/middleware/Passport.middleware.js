const passport = require("passport");
const User = require("../db/User");
const bcrypt = require("bcrypt")
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require("passport-local").Strategy;
module.exports.strategy = async function () {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        // passReqToCallback: true
    }, function (email, password, done) {
        console.log(email, password)
        User.findOne({ email: email.toLowerCase() }, async (err, user) => {
            console.log({ user })
            if (err) {
                return done(null, false)
            }
            if (!user) {
                return done(null, false, { message: "user not found" })
            }
            const isMatch = await bcrypt.compare(password, user.password)
            console.log({ isMatch })
            if (!isMatch) {
                return done(null, false, { message: "Incorrect details" })
            }
            else {
                return done(null, user)
            }
        })
    }));
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.BACKEND_URL + "/api/v1/google/callback",
        passReqToCallback: true
    },
        function (req, accessToken, refreshToken, profile, done) {
            console.log({ profile, refreshToken, accessToken })
            User.findOne({ email: profile._json.email.toLowerCase() }, async function (err, user) {
                if (err) {
                    return done(null, false)
                }
                else if (!user) {
                    //save user of not in db
                    console.log("email", profile.email)
                    const user = await new User({
                        name: profile.displayName,
                        password: profile.id,
                        provider: profile.provider,
                        email: profile._json.email.toLowerCase(),
                        picture: profile._json.picture,
                        verify: profile._json.verify
                    })
                    user.save(async (err) => {
                        if (err) {
                            console.log(err)
                            console.log("user is not save")
                            return done(null, false)
                        }
                        else {
                            const user = await User.findOne({ email: profile._json.email })
                            return done(null, user)
                        }
                    })
                }
                else {
                    return done(null, user);
                }
            });
        }
    ));
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.BACKEND_URL + "/api/v1/github/callback"
    },
        function (accessToken, refreshToken, profile, done) {
            console.log({ profile })
            // return done(null, profile)
            User.findOne({ password: profile.id }, async (err, user) => {
                if (err) {
                    return done(null, false)
                }
                if (!user) {
                    const newUser = await new User({
                        name: profile.displayName,
                        password: profile.id,
                        email: profile._json.email ? profile._json.email.toLowerCase() : profile.displayName,
                        picture: profile._json.avatar_url,
                        provider: profile.provider,
                        verify: true,
                    })
                    newUser.save(async (err) => {
                        if (err) {
                            console.log(err)
                            return done(null, false)
                        }
                        else {
                            const user = await User.findOne({ password: profile.id })
                            return done(null, user)
                        }
                    })
                }
                else {
                    return done(null, user);
                }
            })
        }
    ));
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.BACKEND_URL + "/api/v1/fb/callback"
    },
        //TODO: for FACEBOOK API
        function (accessToken, refreshToken, profile, cb) {
            return done(null, profile)
            User.findOrCreate({ password: profile.id }, function (err, user) {
                return cb(err, user);
            });
        }
    ));
    passport.serializeUser(function (user, done) {
        console.log(`seriealice, ${user}`)
        return done(null, user._id);
    });
    passport.deserializeUser(function (_id, done) {
        console.log("deserialize user", _id)
        User.findOne({ _id }, function (err, user) {
            if (err) {
                return done(null, false)
            }
            else {
                return done(null, user);
            }
        });
    });
}