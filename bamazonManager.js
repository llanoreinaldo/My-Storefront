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
    var query = "SELECT * FROM products"
    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: "choice",
                    type: "input",
                    message: "Enter the ID # of the product you would like to buy?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many units would you like to add?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                var chosenItem,
                    currentAmt,
                    addAmt,
                    newAmt;
                
                for (var i = 0; i < res.length; i++) {
                    if (parseInt(res[i].item_id) === parseInt(answer.choice)) {
                        chosenItem = res[i];
                        currentAmt = chosenItem.stock_quantity;
                        addAmt = answer.quantity
                        newAmt = currentAmt + addAmt;
                        console.log(chosenItem, currentAmt, addAmt, newAmt);
                        debugger;
                    }
                    if (chosenItem.item_id === parseInt(answer.choice)) {
                        connection.query(
                            "UPDATE products SET ? WHERE ?", [{
                                    stock_quantity: newAmt
                                },
                                {
                                    item_id: chosenItem.item_id
                                }
                            ],
                            function (error) {
                                if (error) throw err;
                                console.log("Sorry, you're Add Inventory Request failed.  Please try again!");
                            });
                        menuOptions()
                    }
                };
            });
    });
}

function addNewProduct() {

};