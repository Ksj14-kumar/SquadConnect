const path = require("path")
const fs = require("fs")
class Resources {
    simpleCheck = async (req, res) => {
        try {
            return res.send("user")
        } catch (err) {
            console.log(err)
            return res.status(500).send("something error")
        }
    }
    getFile = async (req, res) => {
        try {
            console.log(req.headers)
            const filePath = req.headers.filepath
            const fileFullPath = path.resolve(__dirname, "../Socket/Messagefile/" + filePath)
            console.log({ fileFullPath })
            const readFile = fs.createReadStream(fileFullPath)
            readFile.pipe(res)
        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occured")
        }
    }
}
module.exports = new Resources()