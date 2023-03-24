const router = require("express").Router()
const passport = require("passport")
const { register, googleCallback, gitHubCallback, faceBookCallback, failed, success, logout, loginWithPassword } = require("../Controller/login")
router.post("/register", register)
// loginWithPassword
router.post("/login", loginWithPassword)
router.get("/login/google", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/login/github", passport.authenticate("github", { scope: ["email", "profile"] }))
router.get("/login/facebook", passport.authenticate("facebook", { scope: ["email", "profile", 'user_friends', 'manage_pages'] }))
router.get('/google/callback', googleCallback)
router.get('/github/callback', gitHubCallback)
router.get('/fb/callback', faceBookCallback)
router.get("/success", success)
router.get("/failed", failed)
router.get("/admin", async (req, res) => {
    try {
        return res.status(200).send("successs")
    } catch (err) {
        return res.status(500).send("successs")
    }
})
router.post("/logout", logout)
module.exports = router;