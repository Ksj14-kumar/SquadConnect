const { isEmailValid, isPasswordValid } = require("../Validation/Validate")
const User = require("../db/User")
const { ImageGenerate } = require("../Config/RandomImageGenerator")
const bcrypt = require("bcrypt")
const passport = require("passport")
const jwt = require("jsonwebtoken")
class Login {
    register = async (req, res) => {
        try {
            console.log(req.body)
            const { email, password, cPassword } = req.body
            if (!email || !password || !cPassword) {
                return res.status(403).send("all fields are required")
            }
            //already exit
            const findUser = await User.findOne({ email }).exec()
            if (findUser) {
                return res.status(409).send("email already use")
            }
            if (password !== cPassword) {
                return res.status(400).send("password not match")
            }
            if (!isEmailValid(email)) {
                return res.status(400).send("invalid email")
            }
            if (!isPasswordValid(password)) {
                return res.status(400).send("invalid password format, at least one uppercase, one lowercase and one numeric character,one special character,Length must be between 10 to 16 characters.")
            }
            const newUser = await new User({
                email: email.toLowerCase(),
                password: await bcrypt.hashSync(password, 10),
                provider: "self",
                picture: "",
                verify: false,
                name: email
            })
            await newUser.save(async (err) => {
                if (err) {
                    console.log(err)
                    return res.status(500).send("not created")
                }
                else {
                    const foundUser = await User.findOne({ email: email.toLowerCase() }).exec()
                    if (foundUser) {
                        foundUser.picture = await ImageGenerate(email, foundUser._id)
                        await foundUser.save()
                    }
                    return res.status(201).send("created")
                }
            })
        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    }
    loginWithPassword = async (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            console.log({ user, info, err })
            if (err) {
                // throw new Error(err)
                console.log(err)
                return res.status(400).send("something error occured")
            }
            if (!user) {
                return res.status(400).send(info.message)
            }
            else {
                req.logIn(user, async (err) => {
                    if (err) {
                        // throw new Error(err)
                        console.log({ err })
                        return res.status(500).send("something error occured")
                    }
                    else {
                        console.log("found user")
                        console.log({ user })
                        if (req.isAuthenticated()) {
                            const { name, email, picture, _id } = req.user
                            const token = await jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: process.env.Expires_Time_Token })
                            console.log({ token })
                            res.cookie("tt", token, { expires: process.env.Expires_Time_Token, maxAge: process.env.MAX_AGE, secure: false })
                            return res.status(200).send(JSON.stringify({ email, name, picture, _id }))
                        }
                        else {
                            return res.status(401).send("unauthorized")
                        }
                    }
                })
            }
        })(req, res, next)
    }
    googleCallback = (req, res, next) => {
        passport.authenticate("google", {
            failureRedirect: "/api/v1/failed",
            successRedirect: process.env.UI_URL,
            successMessage: "successfull login",
            failureMessage: "not login"
        })(req, res, next)
    }
    faceBookCallback = (req, res, next) => {
        passport.authenticate("facebook", {
            failureRedirect: "/api/v1/failed",
            successRedirect: process.env.UI_URL,
            successMessage: "successfull login",
            failureMessage: "not login"
        })(req, res, next)
    }
    gitHubCallback = (req, res, next) => {
        passport.authenticate("github", {
            failureRedirect: "/api/v1/failed",
            successRedirect: process.env.UI_URL,
            successMessage: "successfull login",
            failureMessage: "not login"
        })(req, res, next)
    }
    success = async (req, res) => {
        try {
            console.log("user is find")
            console.log(req.user)
            console.log(req.isAuthenticated())
            if (req.isAuthenticated()) {
                const { picture, name, _id, email } = req.user
                const token = await jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: process.env.Expires_Time_Token })
                console.log({ token })
                res.cookie("tt", token, { expires: process.env.Expires_Time_Token, maxAge: process.env.MAX_AGE, secure: false })
                return res.status(200).json({ picture, name, _id, email })
            }
            else {
                return res.status(401).send("unauthorized")
            }
        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occured" + err)
        }
    }
    failed = async (req, res) => {
        try {
            return res.send("failed")
        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occured")
        }
    }
    logout = async (req, res, next) => {
        try {
            // req.destroy()
            req.logout(function (err) {
                if (err) {
                    console.log(err)
                    return next(err)
                }
                return res.status(200).json({ message: "logout" })
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "something error occured" })
        }
    }
}
module.exports = new Login()