import client from "../database";
import { Product } from "../types/product.type";

export class ProductModel {

    // create new product
    async createProduct(p : Product) : Promise<Product> {
        try {
            // connect to database
            const connection = await client.connect();

            // create sql query to insert product info to products table
            const sql = 'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *';

            const result = await connection.query(sql, [
                p.name, 
                p.price, 
            ]);

            // release database connection
            connection.release();

            // get the created product
            return result.rows[0];
        } catch (error) {
            throw new Error (`un able to create new product ${p.name}. Error: ${(error as Error).message}`)
        }
    }

    // display all products
    async getProducts() : Promise<Product[]> {
        try {
            // connect to database
            const connection = await client.connect();

            // create sql query to get all info about all products
            const sql = 'SELECT * FROM products';

            const result = await connection.query(sql);

            // release database connection
            connection.release();

            // get all products
            return result.rows;
        } catch(error) {
            throw new Error(`Un able to display products. Error: ${(error as Error).message}`);
        }
    }

    // display a specific product with its id
    async getProduct(id : string) : Promise<Product> {
        try {
            // connect to database
            const connection = await client.connect();
            
            // create sql query to all product info
            const sql = 'SELECT * FROM products WHERE id = ($1)';

            const result = await connection.query(sql, [parseInt(id)]);

            // release database connection
            connection.release();

            // get the product
            return result.rows[0];
        } catch(error) {
            throw new Error(`Un able to display the product ${id}. Error: ${(error as Error).message}`);
        }
    }

    // update product info
    async updateProduct(p : Product) : Promise<Product> {
        try {
            // connect to database
            const connection = await client.connect();
            
            // create sql query to all product info
            const sql = 'UPDATE products SET name=$1, price=$2 WHERE id=$3 RETURNING *';

            const result = await connection.query(sql, [
                p.name,
                p.price,
                p.id
            ]);

            // release database connection
            connection.release();

            // get the product
            return result.rows[0];
        } catch(error) {
            throw new Error(`Un able to update the product ${p.name}. Error: ${(error as Error).message}`);
        }
    }

    // delete a specific product by its id
    async deleteProduct(id : string) : Promise<Product> {
        try {
            // connect to database
            const connection = await client.connect();
            
            // create sql query to delete a product
            const sql = 'DELETE FROM products WHERE id = ($1)';

            const result = await connection.query(sql, [parseInt(id)]);

            // release database connection
            connection.release();

            // get the deleted product
            return result.rows[0];
        } catch(error) {
            throw new Error(`Un able to delete the product ${id}. Error: ${(error as Error).message}`);
        }
    }
}