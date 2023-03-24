module.exports.isAuth = (req, res, next) => {
    // console.log(req.session)
    // console.log(req)
    try {
        if (req.isAuthenticated()) {
            next()
        }
        else {
            return res.status(401).send("unauthorized")
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
}