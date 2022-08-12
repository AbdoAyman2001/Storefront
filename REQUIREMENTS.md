# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Users
- ##### Index
  - **[token required]**
  - **GET** `/users`
  - returns you list of users with their details. 

- ##### Show
  - **[token required]**
  - **GET** `/users/:userId`
  - return you single user.

- ##### Create (SignUp) 
  - **POST** `/singup`
  - **Expected request body data :**
    ```
    {
        "firstName":"<your first name>",
        "secondName":"<your second name>",
        "password":"<your password>"
    }
    ```
  - returns token to be stored and used in the next requests where token is required, to add the token you need to assign it to the authorization header.  


- ##### Login
  - **POST** on `/login`
  - **Expected body data :**
    ```
    {
        "firstName":"<your first name>",
        "secondName":"<your second name>",
        "password":"<your password>"
    }
    ```
  - returns you a token.

- ##### Delete
  - **[token required]**
  - **DELETE** `/users/:userId`
  - returns the deleted user.

<br/>

#### Products
- ##### Index
  - **[token required]**
  - **GET** `/products`
  - returns you a list of all products in the database.

- ##### Create
  - **[token required]**
  - **POST** `/products`
  - Expected request body to be : 
  ```
  {
    "name": "your-product",
    "price": price<integer> ,
    "category":"your-category"
  }
  ```
  - Expected response to be the added product with an id.

- ##### Show
  - **GET** `/products/:productId`
  - fetches specific product based on the id in the url.
  
- ##### Delete
  - **[token required]**
  - **DELETE** `/products/:productId/ `
  - it deletes the specified product based on the url paramater
  - returns the deleted product

<br/>

#### Orders
- ##### Index
  - **[token required]**
  - **GET** `/orders/:userId`
  - Current Orders by user, the id can be fetched from the url params OR from the token. Both are implemented.

- ##### Show
  - **[token required]**
  - **GET** `/order/:orderId`
  - it shows information for you about a single order

- ##### Create
  - **[token required]**
  - **POST** `/orders/:userId`
  - it creates order for specified the logged in user from the token 
  - expected body request to be : 
  ```
  {
    "status": "active"
  }
  ```
  - status should be "active" or "complete".
  - returns the created order. 


<!-- to be implemented -->

- ##### Delete
  - **[token required]**
  - **DELETE** on `/orders/:orderId`
  - deletes the order for the logged in user throught the token

- ##### Add Product To The Order
  - **[token required]**
  - **POST** on `/orders/:orderId/products`
  - it adds product to the specified order

- ##### Index Completed Orders
  - **[token required]**
  - **GET** on ```/completed-orders/:userId```
  - returns all the completed orders done by the user.

## Data Shapes

#### User
  - id
  - firstName
  - lastName
  - password

#### Product
- id
- name
- price
- category

#### Orders
- id
- user_id
- status of order

#### Order_Products
- order_id
- product_id
- quantity