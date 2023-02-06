const router = require("express").Router();
require("dotenv").config();





router.get("/", (req, res) => {
    res.send({
        message: "Authors information"
    })
})






module.exports = router;