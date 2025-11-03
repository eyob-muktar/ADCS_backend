# ADCS_backend

## Overview
ADCS_backend is a Node.js backend for a food ordering app. It handles various functionalities such as user management, order processing, and data persistence.

## Features
- User authentication and authorization
- Order creation and management
- Integration with a database for persistent storage
- API endpoints for interacting with the frontend

## Installation

To get started with the ADCS_backend, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/eyob-muktar/ADCS_backend.git
   cd ADCS_backend
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add the necessary environment variables.

4. **Run the backend:**
   ```bash
   yarn start
   ```

## Project Structure

- `config/` - Contains configuration files.
- `middleware/` - Custom middleware for request processing.
- `models/` - Database models and schemas.
- `routes/` - API routes definitions.
- `startup/` - Initial setup scripts and configurations.
- `tests/` - Test cases for the backend functionalities.

## API Endpoints

### User Endpoints
  - **`POST /users`** - Register a new user.

- **`POST /users/login`** - Log a user in and return a JWT token.

- **`GET /users/me`** - Return the current user's information.

- **`GET /users`** - Return a list of all users.

- **`PATCH /users/balance/:id`** - Update the balance of a user.

- **`DELETE /users/me`** - Delete the current user.

- **`GET /users/user`** - Find a user by their name.

### Food Endpoints
- **`POST /foods`** - Add a new food item.

- **`GET /foods`** - Get all food items.

- **`GET /foods/search`** - Get a specific food item by name.

- **`GET /foods/:id`** - Get a specific food item by ID.

- **`PATCH /foods/rating/:id`** - Update the rating of a food item.

- **`PATCH /foods/:id`** - Update information of a specific food item.

- **`DELETE /foods/:id`** - Delete a specific food item.


### Order Endpoints
- **`POST /orders`** - Add a new order.

- **`GET /orders`** - Get all orders sorted by order time in descending order.

- **`DELETE /orders/:id`** - Delete a specific order.

- **`GET /orders/myorders`** - Find orders for a specific user.

- **`PATCH /orders/status/:id`** - Update the status of an order.


## Testing
To run tests, use the following command:
```bash
yarn test
```
