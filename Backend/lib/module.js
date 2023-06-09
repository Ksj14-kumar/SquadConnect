const express = require('express')
const app = express()
const morgan = require("morgan")
const helmet = require("helmet")
const mongoose = require("mongoose")
const fs = require("fs");
const path = require("path")
const bodyParser = require("body-parser")
const registerLoginRouter = require("../Router/RegisterLogin")
const passport = require("passport")
const expressSession = require("express-session")
const mongoStore = require("connect-mongo")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const utl = require("util")
const jdenticon = require("jdenticon");
const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const resouces = require("../Router/resources")
module.exports = { fs, path, mongoose, bodyParser, app, morgan, helmet, registerLoginRouter, passport, expressSession, mongoStore, cors, cookieParser, utl, jdenticon, bcrypt, LocalStrategy, GoogleStrategy, GitHubStrategy, FacebookStrategy,resouces }
