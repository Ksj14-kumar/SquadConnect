const fs = require("fs")
const jdenticon = require("jdenticon")
const path = require("path")
module.exports.ImageGenerate = (name, id) => {
    const currentDir = path.join(__dirname, `../ProfileImages/${id}`)
    const size = 200;
    const value = name;
    const png = jdenticon.toPng(value, size);
    const date = new Date().getTime()
    const userImagePath = path.join(currentDir, `/-${date}.png`)
    try {
        if (!fs.existsSync(currentDir)) {
            fs.mkdirSync(currentDir)
        }
        fs.writeFileSync(userImagePath, png);
        return userImagePath
    } catch (err) {
        console.log(err)
        return false
    }
}