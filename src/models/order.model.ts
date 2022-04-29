import client from "../database";
import { Order } from "../types/order.type";

export class OrdersModel {

    // create new order
    async createOrder(o : Order) : Promise<Order> {
        try {
            // connect to database
            const connection = await client.connect();

            // create sql query to insert order info to orders table
            const sql = 'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *';

            const result = await connection.query(sql, [
                o.user_id, 
                o.status
            ]);

            // release database connection
            connection.release();

            // get the created order
            return result.rows[0];
        } catch (error) {
            throw new Error (`un able to create new order for the user ${o.user_id}. Error: ${(error as Error).message}`)
        }
    }

    // display a specific order with its id
    async getOrder(id : string) : Promise<Order> {
        try {
            // connect to database
            const connection = await client.connect();
            
            // create sql query to all order info
            const sql = 'SELECT * FROM orders WHERE id = ($1)';

            const result = await connection.query(sql, [parseInt(id)]);

            // release database connection
            connection.release();

            // get the order
            return result.rows[0];
        } catch(error) {
            throw new Error(`Un able to display the order ${id}. Error: ${(error as Error).message}`);
        }
    }

    // display all orders
    async getOrders() : Promise<Order[]> {
        try {
            // connect to database
            const connection = await client.connect();

            // create sql query to get all info about all orders
            const sql = 'SELECT * FROM orders';

            const result = await connection.query(sql);

            // release database connection
            connection.release();

            // get all orders
            return result.rows;
        } catch(error) {
            throw new Error(`Un able to display orders. Error: ${(error as Error).message}`);
        }
    }

    // update order info
    async updateOrder(o : Order) : Promise<Order> {
        try {
            // connect to database
            const connection = await client.connect();
            
            // create sql query to update all order info
            const sql = 'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *';

            const result = await connection.query(sql, [
                o.status,
                o.id
            ]);

            // release database connection
            connection.release();

            // get the order
            return result.rows[0];
        } catch(error) {
            throw new Error(`Un able to update the order ${o.id}. Error: ${(error as Error).message}`);
        }
    }

    // delete a specific order by its id
    async deleteOrder(id : string) : Promise<Order> {
        try {
            // connect to database
            const connection = await client.connect();
            
            // create sql query to delete an order
            const sql = 'DELETE FROM orders WHERE id = ($1)';

            const result = await connection.query(sql, [parseInt(id)]);

            // release database connection
            connection.release();

            // get the deleted order
            return result.rows[0];
        } catch(error) {
            throw new Error(`Un able to delete the order ${id}. Error: ${(error as Error).message}`);
        }
    }

    // add a new product to an order
    async addProduct(productId : string, orderId : string, quantity : number) : Promise<Order> {
        try {
            // connect to database
            const connection = await client.connect();
            
            // create sql query to all order info
            const sql = 'SELECT * FROM orders WHERE id = ($1)';

            const result = await connection.query(sql, [orderId]);

            // release database connection
            connection.release();

            // get the order
            const order =  result.rows[0];

            // check if the order status is open or not
            if (order.status !== 'open') {
                throw new Error(`Un able to add new product ${productId} to the order ${orderId}`);
            }
        } catch (error) {
            throw new Error(`Error: ${(error as Error).message}`);
        }

        try {
            // connect to database
            const connection = await client.connect();
            
            // create sql query to all order info
            const sql = 'INSERT INTO order_products (product_id, order_id, quantity) VALUES $1, $2, $3';

            await connection.query(sql, [
                productId,
                orderId,
                quantity,
            ]);

            const viewSQL = 'SELECT * FROM order_products WHERE order_id = $1';

            const result = await connection.query(viewSQL, [orderId]);

            // release database connection
            connection.release();

            // get the order
            return result.rows[0];
        } catch(error) {
            throw new Error(`Un able to add new product ${productId} to the order ${orderId}. Error: ${(error as Error).message}`);
        }
    }
}