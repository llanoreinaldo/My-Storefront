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
    readProducts();
});


// Function that displays products inventory available
function readProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("Bamazon Store Iventory List");
        console.log("-----------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " | Name: " + res[i].product_name + " | Price: " + res[i].price);
        };
        orderProducts();
    }, )
};

//Function to order products
function orderProducts() {
    var query = "SELECT * FROM products";
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
                    message: "How many units would you like to buy?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
            ])
            .then(function (answer) {
                var chosenItem
                for (var i = 0; i < res.length; i++) {
                    if (parseInt(res[i].item_id) === parseInt(answer.choice)) {
                    chosenItem = res[i];
                    }
                }
                if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
                    connection.query(
                        "UPDATE products SET ? WHERE ?", 
                        [
                            {
                                stock_quantity: chosenItem.stock_quantity - parseInt(answer.quantity)
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Thank you for your business!")
                            console.log("Your order total was:  $" + (chosenItem.price * parseInt(answer.quantity)))
                        }
                    )
                } else {
                    console.log("Insufficient Quantity!")
                }
            })
    })
};