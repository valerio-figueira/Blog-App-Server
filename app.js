const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const flash = require("connect-flash");
require("dotenv").config();
const PORT = 3000;
const Posts = require("./routes/posts");
const Authors = require("./routes/authors");
const Categories = require("./routes/categories");

const { createSQLConnection, isAuthenticated } = require("./routes/controller");


app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use(session({
    secret: "blogAppSecretKeyForSession",
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(flash());

app.use((req, res, next) => {
    // GLOBAL VARIABLES
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.alert_msg = req.flash("alert_msg");
    res.locals.warning_msg = req.flash("warning_msg");
    next();
});

app.set('view engine', 'ejs');

app.use(express.static(path.join("public")));



app.use("/posts", Posts);
app.use("/authors", Authors);
app.use("/categories", Categories);



app.get("/login", (req, res) => {
    const success_msg = res.locals.success_msg;
    const error_msg = res.locals.error_msg;
    const alert_msg = res.locals.alert_msg;

    res.render("login", {
        success_msg,
        error_msg,
        alert_msg
    });
})

app.post("/login", express.urlencoded({ extended: false }), (req, res) => {
    const con = createSQLConnection();
    const errors = [];

    console.log(typeof req.body.email)
    console.log(typeof req.body.password)

    if(req.body.email == '' || typeof req.body.email == undefined || req.body.email == null){
        errors.push({text: "Digite o email"});
    }

    if(req.body.password == '' || typeof req.body.password == undefined || req.body.password == null){
        errors.push({text: "Digite a senha"});
    }

    if(errors.length > 0){
        res.render('login', {errors});
    } else{
        con.connect(error => {
            if(error){
                req.flash("error_msg", "Não foi possível conectar-se ao servidor: " + error);
                res.redirect("/login");
            } else{
                con.query(`SELECT * FROM AUTHORS WHERE email='${req.body.email}' AND password='${req.body.password}'`, (error, result) => {
                    if(error){
                        con.end();
                        req.flash("error_msg", "Não foi possível fazer login: " + error);
                        res.redirect("/login");
                    } else{
                        const user = result[0] || result;
    
                        if(req.body.email === user.email && req.body.password === user.password){
                            req.session.regenerate((error) => {
                                if(error) next(error);
                                user.password = null;
                                user.created_at = new Date(user.created_at).toLocaleString();
                                req.session.user = user;
        
                                con.end();
                                req.session.save(error => {
                                    if(error) next(error);
                                    res.redirect("/");
                                })
                            })
                        } else{
                            con.end();
                            req.flash("error_msg", "Login inválido!");
                            res.redirect("/login");
                        }
                    }
                })
            }
        })
    }
})

app.get("/logout", (req, res, next) => {
    req.session.user = null;
    req.session.save((error) => {
        if(error) next(error);

        req.session.regenerate((error) => {
            if(error) next(error);
            res.redirect("/login");
        })
    })
})

app.get("/", isAuthenticated, (req, res) => {
    res.render("index", {
        user: req.session.user
    });
})



app.listen(PORT, () => {
    console.log("Express server is up!")
})