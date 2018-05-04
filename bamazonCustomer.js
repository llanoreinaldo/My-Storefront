var mysql = require("mysql");
var inquirer = require("inquirer");

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


function readProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("Bamazon Store Iventory List");
        console.log("-----------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log("Product: " + res[i].product_name + " | Avail Qty: " + res[i].stock_quantity);
        };        
        orderProducts();
},
)};

function orderProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: "choice",
                    type: "list",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].product_name)
                        }
                        return choiceArray;
                    },
                    message: "Which item would you like to buy?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to buy?"
                },
            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.choice) {
                        chosenItem = res[i]
                    }
                }

                if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
                    connection.query(
                        "UPDATE products SET ? WHERE ?", 
                    [
                        {
                            stock_quantity: stock_quantity - answer.quantity
                        },
                        {
                            item_id: chosenItem.item_id
                        }
                    ],
                    function(error) {
                        if (error) throw err;
                        console.log("Sorry, we don't have enough inventory")
                    }
                    )
                }

            })
    })
};