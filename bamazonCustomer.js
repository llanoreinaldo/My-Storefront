var mysql = require("mysql");
var inquirer = require ("inquirer");

var connection = mysql.createConnection({

    host: "localhost",
    port: 3306,

    //My Username
    user: "root",

    //My Password
    password: "Reinaldo33!",
    database: "bamazon",

})

