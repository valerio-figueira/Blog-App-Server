const mysql = require("mysql");
require("dotenv").config();


const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const HOST_NAME = process.env.HOST_NAME;



// FUNCTIONS
function createSQLConnection(){
    const connection = mysql.createConnection({
        host: HOST_NAME,
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD
    });

    return connection;
}

function isAuthenticated (req, res, next) {
    if (req.session.user){
        next();
    } else{
        req.flash("alert_msg", "Faça login primeiro")
        res.redirect("/login")
        next();
    }
}

module.exports = { createSQLConnection, isAuthenticated }