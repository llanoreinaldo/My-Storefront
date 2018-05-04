DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price DECIMAL(10,2),
stock_quantity INT default 0,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
vALUES ("M&M's", "Candy", 2.49, 50), ("Water", "Groceries", 1.99, 150), ("Watermelon", "Fruits & Vegetables", 3.49, 75), ("French Bread", "Bakery", 3.49, 40), ("Tide Detergent", "Home Cleaning", 8.69, 200), ("Tony the Tiger Cereal", "Groceries", 2.49, 50), ("Coca Cola 2 ltr", "Groceries", 2.49, 50), ("Boars Head Turkey", "Deli", 2.49, 30), ("Gouda Cheese", "Deli", 2.49, 30), ("Milk", "Dairy", 3.49, 50);
