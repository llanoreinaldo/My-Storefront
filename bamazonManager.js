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


function displayLowInv() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Bamazon Store Iventory List");
            console.log("--------------------------------------------------------------------------------");
            console.log("Item ID: " + res[i].item_id + " | Product Name: " + res[i].product_name + " | Price: " + res[i].price + " | Quantities: " + res[i].stock_quantity);
            console.log("--------------------------------------------------------------------------------");
        };
        menuOptions();
    })
};

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: "item",
                    type: "list",
                    message: "Which item would you like to add more of?",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].product_name);
                        }
                        return choiceArray;
                    }
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many units would you like to add?"
                }
            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.product_name) {
                        chosenItem = res[i];
                    }
                    connection.query(
                        "UPDATE products SET ? WHERE ?", 
                        [
                            {
                                stock_quantity: chosenItem.stock_quantity + parseInt(answer.quantity)
                            },
                            {
                                id: chosenItem.id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Sorry, you're Add Inventory Request failed.  Please try again!");
                        }
                    );
                };
                menuOptions();
            });

    });

}