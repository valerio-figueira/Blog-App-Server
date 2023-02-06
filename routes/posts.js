const router = require("express").Router();
require("dotenv").config();


const { createSQLConnection, isAuthenticated } = require("./controller");



router.post("/", isAuthenticated, (req, res) => {
    const con = createSQLConnection();

    con.connect(error => {
        if(error){
            req.flash("error_msg", "Ocorreu um erro: " + error);
            res.redirect("/posts")
        } else{
            con.query(`INSERT INTO POSTS VALUES(DEFAULT, 1, '${req.body.postTitle}', '${req.body.postContent}', '${req.body.metaTitle}', '${req.body.slug}', NULL, '${req.body.publish}', DEFAULT, NULL)`, (error, result) => {
                if(error){
                    con.end();
                    req.flash("error_msg", "Ocorreu um erro: " + error);
                    res.redirect("/posts")
                } else{
                    // INSERT HERE CATEGORIES AND TAGS INTO THEIR RESPECTIVELY TABLES
                    console.log(result)
                    const postID = result.insertId;

                    const checkResult = req.body.categoryID.every(categoryID => {
                        console.log("IDs:")
                        console.log(categoryID)
                        console.log(typeof categoryID)
                        con.query(`INSERT INTO POST_CATEGORIES VALUES(DEFAULT, '${postID}', '${categoryID}')`, (error, result) => {
                            if(error){
                                req.flash("error_msg", "Ocorreu um erro: " + error);
                                return false;
                            }
                        })
                        return true;
                    })
                    console.log(checkResult)
                    if(checkResult){
                        con.end();
                        req.flash("success_msg", "Postagem registrada com sucesso!");
                        res.redirect("/posts")
                    } else{
                        con.end();
                        res.redirect("/posts")
                    }
                }
            })
        }
    })
})

router.get("/create", isAuthenticated, (req, res) => {
    const con = createSQLConnection();

    con.connect(error => {
        if(error){
            throw error
        } else{
            con.query(`SELECT category_id, title, slug FROM CATEGORIES`, (error, data) => {
                if(error){
                    throw error
                } else{
                    const categories = data;                    
                    con.end();
                    res.render("pages/posts/createPost", {
                        categories
                    });
                }
            })
        }
    })
})


router.get("/", (req, res) => {
    const con = createSQLConnection();
    
    con.connect(error => {
        if(error){
            throw error
        } else{
            con.query(`SELECT * FROM POSTS`, (error, data) => {
                if(error){
                    throw error
                } else{
                    const posts = data;  

                    con.end();
                    res.render("pages/posts/listPost", {
                        posts
                    });
                }
            })
        }
    })
})





module.exports = router;