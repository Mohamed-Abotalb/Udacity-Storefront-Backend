# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Get All Products [/products](/products) [GET] 
- Get One Product [/products/:id](/products/:id) [GET]
- Create Product [/products/create](/products/create) [POST] [token required]
- Update Product [/products/:id](/products/:id) [PATCH] [token required]
- Delete Product [/products/:id](/products/:id) [DELETE] [token required]

#### Users
- Get All Users [/users](/users) [GET] [token required]
- Get One User [/users/:id](/users/:id) [GET] [token required]
- Create User [/users/create](/users/create) [POST] 
- Update User [/users/:id](/users/:id) [PATCH] [token required]
- Delete User [/users/:id](/users/:id) [DELETE] [token required]
- Authentication [/users/authenticate](/users/authenticate) [POST]

#### Orders
- Get All Orders [/orders](/orders) [GET] [token required]
- Get One Order [/orders/:id](/orders/:id) [GET] [token required]
- Create Order [/orders/create](/orders/create) [POST] [token required]
- Update Order [/orders/:id](/orders/:id) [PATCH] [token required]
- Delete Order [/orders/:id](/orders/:id) [DELETE] [token required]
- Add Products to Order [/orders/:id/products](/orders/:id/products) [POST] [token required]

## Data Shapes
#### Product
Table : products
-  id [SERIAL PRIMARY KEY]
- name [VARCHAR]
- price [INTEGER]

#### User
Table : users
- id [SERIAL PRIMARY KEY]
- firstName [VARCHAR]
- lastName [VARCHAR]
- password [VARCHAR]

#### Orders
Table : orders
- id [SERIAL PRIMARY KEY]
- user_id [INTEGER] [REFERENCES users(id)]
- status [VARCHAR]

Table : order_products
- order_id [INTEGER] [REFERENCES orders(id)]
- product_id [INTEGER] [REFERENCES products(id)]
- quantity [INTEGER]

