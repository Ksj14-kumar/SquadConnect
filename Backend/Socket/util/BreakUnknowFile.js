const fileAllowed = ["jpg", "jpeg", "png", "mp3", "mp4", "mkv", "mid", "mov", "webm", "avi", "wmp", "mpg", "m4a", "opus", "ogg", "flac", "wav", "amr"]
module.exports.fileAllow = (type) => {
    return fileAllowed.some((item) => item === type)
}