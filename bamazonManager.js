var mysql = require("mysql");
var inquirer = require("inquirer");

//Connection user login information
var connection = mysql.createConnection({

    host: "localhost",
    port: 3306,

    //My Username
    user: "root",

    //My Password
    password: "Reinaldo33!",
    database: "bamazon"

});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    menuOptions();
});

//Function to order products
function menuOptions() {
    inquirer
        .prompt([{
            name: "choice",
            type: "list",
            message: "Command Menu Options",
            choices: ["View Products for Sale", "View Low Inventory", "Add Inventory", "Add New Product"]
        }])
        .then(function (answer) {
            //console.log(answer)
            if (answer.choice === "View Products for Sale") {
                displayInventory();
            } else if (answer.choice === "View Low Inventory") {
                displayLowInv();
            } else if (answer.choice === "Add Inventory") {
                addInventory();
            } else if (answer.choice === "Add New Product") {
                addNewProduct();
            }
        })
};

function displayInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("Bamazon Store Iventory List");
        console.log("--------------------------------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " | Product Name: " + res[i].product_name + " | Price: " + res[i].price + " | Quantities: " + res[i].stock_quantity);
            console.log("--------------------------------------------------------------------------------");
        };
       menuOptions(); 
    });
  
}

/*
function displayLowInv() {

};

function addInventory() {

};

function addNewProduct() {

}*/