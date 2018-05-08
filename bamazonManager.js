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
                    addAmt;

                for (var i = 0; i < res.length; i++) {
                    if (parseInt(res[i].item_id) === parseInt(answer.choice)) {
                        chosenItem = res[i];
                        currentAmt = chosenItem.stock_quantity;
                        addAmt = parseInt(answer.quantity);
                    };
                }
                if (chosenItem.item_id === parseInt(answer.choice)) {
                    connection.query(
                        "UPDATE products SET ? WHERE ?", [{
                                stock_quantity: currentAmt + addAmt
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Your request to add inventory has been received and processed.");
                            menuOptions()
                        });

                } else {
                    console.log("Sorry, you're Add Inventory Request failed.  Please try again!");
                }

            });
    });
}

function addNewProduct() {
    var query = "SELECT * FROM products"
    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: "product_name",
                    type: "input",
                    message: "What is the name of the new product",
                },
                {
                    name: "department_name",
                    type: "input",
                    message: "What department is this product in?",
                },
                {
                    name: "price",
                    type: "input",
                    message: "What price will this product be sold?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "stock_quantity",
                    type: "input",
                    message: "How many items are on stock?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                var prodDoesNotExists = true,
                newProduct,
                newDeptName,
                newPrice,
                newQty;

                for (var i = 0; i < res.length; i++) {

                    if (parseInt(res[i].product_name) === (answer.product_name)) {
                        console.log("Sorry, this item already exists. Select Add Inventory instead.");
                        prodDoesNotExists = false;
                        menuOptions();
                    }
                }

                if (prodDoesNotExists === true) {

                    newProduct = answer.product_name;
                    newDeptName = answer.department_name;
                    newPrice = parseInt(answer.price);
                    newQty = parseInt(answer.stock_quantity);
                    console.log(newProduct, newDeptName, newPrice, newQty);

                    connection.query(
                        "INSERT INTO products SET ?", [
                        {
                            product_name: newProduct,
                            department_name: newDeptName,
                            price: newPrice,
                            stock_quantity: newQty
                        }
                    ],
                        function (error) {
                            if (error) throw err;
                            console.log("Your request to add a new product to the inventory has been received and processed.");
                            menuOptions()
                        });
                } else {
                    console.log("Sorry, you're Add New Product Request failed.  Please try again!");
                }

            })
    });
}