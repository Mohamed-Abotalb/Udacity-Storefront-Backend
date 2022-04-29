import { User } from "../types/user.type";
import client from "../database";
import config from "../config";
import bcrypt from 'bcrypt';

// create password hashing function
export const hashPassword = (password : string) => {
    const hash = bcrypt.hashSync(
        password + config.pepper,
        parseInt(config.salt as string)
    );
    return hash;
}

export class UserModel {

    // create new user
    async createUser(u : User) : Promise<User> {
        try {
            // connect to database
            const connection = await client.connect();

            // create sql query to insert user info to database
            const sql = 'INSERT INTO users (first_name, last_name, password) VALUES ($1, $2, $3) RETURNING *';

            const result = await connection.query(sql, [
                u.first_name, 
                u.last_name, 
                hashPassword(u.password)
            ]);

            // release database connection
            connection.release();

            // get the created user
            return result.rows[0];
        } catch (error) {
            throw new Error (`un able to create new user ${u.first_name}. Error: ${(error as Error).message}`)
        }
    }

    // display a specific user with its id
    async getUser(id : string) : Promise<User> {
        try {
            // connect to database
            const connection = await client.connect();
            
            // create sql query to all user info
            const sql = 'SELECT * FROM users WHERE id = ($1)';

            const result = await connection.query(sql, [id]);

            // release database connection
            connection.release();

            // get the user
            return result.rows[0];
        } catch(error) {
            throw new Error(`Un able to display the user ${id}. Error: ${(error as Error).message}`);
        }
    }

    // display all users
    async getUsers() : Promise<User[]> {
        try {
            // connect to database
            const connection = await client.connect();

            // create sql query to get all info about all users
            const sql = 'SELECT * FROM users';

            const result = await connection.query(sql);

            // release database connection
            connection.release();

            // get all users
            return result.rows;
        } catch(error) {
            throw new Error(`Un able to display users. Error: ${(error as Error).message}`);
        }
    }

    // delete a specific user by its id
    async deleteUser(id : string) : Promise<User> {
        try {
            // connect to database
            const connection = await client.connect();
            
            // create sql query to delete a user
            const sql = 'DELETE FROM users WHERE id = ($1)';

            const result = await connection.query(sql, [id]);

            // get the deleted user
            const user = result.rows[0];

            // release database connection
            connection.release();

            return user;
            
        } catch(error) {
            throw new Error(`Un able to delete the user ${id}. Error: ${(error as Error).message}`);
        }
    }

    // update user info
    async updateUser(u : User) : Promise<User> {
        try {
            // connect to database
            const connection = await client.connect();
            
            // create sql query to all user info
            const sql = 'UPDATE users SET first_name=$1, last_name=$2, password=$3 WHERE id=$4 RETURNING *';

            const result = await connection.query(sql, [
                u.first_name,
                u.last_name,
                hashPassword(u.password),
                u.id
            ]);

            // release database connection
            connection.release();

            // get the user
            return result.rows[0];
        } catch(error) {
            throw new Error(`Un able to update the user ${u.first_name}. Error: ${(error as Error).message}`);
        }
    }
    
    // authenticate user
    async authenticate(first_name : string, password : string) : Promise<User | null> {
        try {
            // connect to database
            const connection = await client.connect();
            
            // create sql query to get the password of the user
            const sql = 'SELECT password FROM users WHERE first_name = ($1)';

            const result = await connection.query(sql, [first_name]);

            // check if the user is found
            if (result.rows.length) {
                const {password : hashedPassword} = result.rows[0];

                if (bcrypt.compareSync(
                    password + config.pepper,
                    hashedPassword
                )) {
                    const user = await connection.query(
                        'SELECT id, first_name, last_name FROM users WHERE first_name=$1',
                        [first_name]
                    )
                    return user.rows[0];
                }
            }

            return null;

        } catch(error) {
            throw new Error(`Un able to authenticate the user ${first_name}. Error: ${(error as Error).message}`);
        }
    }
}