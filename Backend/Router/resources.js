const { isAuth } = require("../Config/isAuth")
const router = require("express").Router()
const { simpleCheck, getFile } = require("../Controller/ResourcesController")
router.use(isAuth)
router.get("/user", simpleCheck)
router.post("/file", getFile)
module.exports = router;