const router = require("express").Router();
require("dotenv").config();


const { createSQLConnection, isAuthenticated } = require("./controller");



router.post("/", isAuthenticated, (req, res) => {
    const con = createSQLConnection();

    con.connect(error => {
        if(error){
            throw error
        } else{
            con.query(`INSERT INTO CATEGORIES VALUES(DEFAULT, '${req.body.categoryTitle}', '${req.body.metaTitle}', '${req.body.slug}')`, (error, result) => {
                if(error){
                    throw error
                } else{
                    console.log(result)

                    con.end();
                    req.flash("success_msg", "Categoria registrada com sucesso!");
                    res.redirect("/categories")
                }
            })
        }
    })
})

router.get("/create", isAuthenticated, (req, res) => {
    const success_msg = res.locals.success_msg;
    const error_msg = res.locals.error_msg;
    const alert_msg = res.locals.alert_msg;

    console.log(success_msg)

    res.render("pages/categories/createCategory", {
        success_msg,
        error_msg,
        alert_msg
    });
})




module.exports = router;