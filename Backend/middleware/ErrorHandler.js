module.exports.error = (err, req, res, next) => {
    console.log(err)
    if (err) {
        return res.status(500).send(err.message)
    }
    else{
        next()
    }
}