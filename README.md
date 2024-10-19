# E-Commerce API

A comprehensive API for an e-commerce platform similar to Amazon or Flipkart. This API allows users to sign up, log in, add products to a cart, place orders, and more. It supports user authentication, authorization, and order management.

## Features

- User Registration: Create a new account.
- User Login: Authenticate using credentials to gain access.
- Place Orders: Purchase products added to the cart.
- View Orders: Retrieve all orders placed by the user.
- Add to Cart: Add items to the shopping cart.
- Checkout: Complete the purchase and update the order status.
- Logout: End the user session.
- Find User-wise, Product-wise ordering quantity with total item value.
- Weekly Orders analysis for the first quarter of 2024.
- Retrieve the Product name and No. of Orders from Sales, excluding products with fewer than 5 Orders.
- Find the products that are sold more than 7 times or have not sold yet in the first quarter of 2024.

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd ecommerce

   ```

2. **Install the dependencies**:

   ```bash
   npm install
   ```

3. **Add dotenv file and below credentials in it**:

   ```bash
   PORT=8000
   JWT_SECRET=<your-jwt-secret>
   DB_NAME=<your-database-name>
   DB_USER=<your-database-username>
   DB_PASSWORD=<your-database-password>
   DB_HOST=<your-database-host>
   DB_PORT=<your-database-port>
   ```

4. **Now run the project**:
   ```bash
   npm start
   ```
