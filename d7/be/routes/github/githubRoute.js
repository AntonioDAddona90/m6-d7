const express = require("express");
const github = express.Router();
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const GithubStrategy = require("passport-github2");
require("dotenv").config();

github.use(
  session({
    secret: process.env.GITHUB_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

github.use(passport.initialize());
github.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

github.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  (req, res) => {
    const redirectUrl = `http://localhost:3000/success?user=${encodeURIComponent(
      JSON.stringify(req.user)
    )}`;
    res.redirect(redirectUrl);
  }
);

github.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    const { user } = req;
    console.log(req.user);



    const token = jwt.sign(user, process.env.JWT_SECRET);
    const redirectUrl = `http://localhost:3000/success/${encodeURIComponent(token)}`;
    res.redirect(redirectUrl);
  }
);

github.get("/success", (req, res) => {
  res.redirect("http://localhost:3000/homepage");
});

module.exports = github;