import { ProductModel } from "../../../models/product.model";
import { UserModel } from "../../../models/users.model";
import { Product } from "../../../types/product.type";
import { User } from "../../../types/user.type";
import client from "../../../database";
import app from "../../../index";
import supertest from "supertest";

const store = new ProductModel();
const userStore = new UserModel();
const request = supertest(app);
let token = '';

describe('Test Product API Endpoints', async () => {
    const user : User = {
        first_name: 'Mohamed',
        last_name: 'Abotalb',
        password: 'password123456789'
    }

    const product : Product = {
        name: "coffee",
        price: 5
    }

    beforeAll(async () => {
        const createdUser : User | null = await userStore.createUser(user);
        user.id = createdUser.id;
        const createdProduct : Product | null = await store.createProduct(product);
        product.id = createdProduct.id;
    });
    
    afterAll(async () => {
        const connection = await client.connect();
        const userSQL : string = 'DELETE FROM users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;';
        const sql : string = 'DELETE FROM products;\nALTER SEQUENCE products_id_seq RESTART WITH 1;';
        await connection.query(userSQL);
        await connection.query(sql);
        connection.release();
    });

    describe('Test CRUD API Methods', () => {
        it('should authenticate to get the user token to be able to create product', async () => {
            const response = await request
                .post('/api/users/authenticate')
                .set('Content-type', 'application/json')
                .send({
                    first_name: 'Mohamed',
                    password: 'password123456789'
                });
            const { id, first_name, token: userToken } = response.body.data;
            expect(response.status).toBe(200);
            expect(id).toBe(user.id);
            expect(first_name).toEqual(user.first_name);
            token = userToken;
        })

        it('should create a new product', async () => {
            const response = await request 
                .post('/api/products/create')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(product);
            const { name, price } = response.body.data;
            expect(response.status).toBe(200);
            expect(name).toBe(product.name);
            expect(price).toBe(product.price);
        });

        it('should get a list of products', async () => {
            const response = await request 
                .get('/api/products')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            const result = response.body.data;
            expect(response.status).toBe(200);
            expect(Object.keys(result).length).toBe(2);
        });

        it('should get product info', async () => {
            const response = await request 
                .get(`/api/products/${product.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            const { name, price } = response.body.data;
            expect(response.status).toBe(200);
            expect(name).toBe("coffee");
            expect(price).toBe(5);
        });

        it('should update product info', async () => {
            const response = await request 
                .patch(`/api/products/${product.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...product,
                    name: "tea"
                })
            const { name, price } = response.body.data;
            expect(response.status).toBe(200);
            expect(name).toBe("tea");
            expect(price).toBe(5);
        });

        it('should delete a product', async () => {
            const response = await request 
                .delete(`/api/products/${product.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            const result = response.body.data;
            expect(response.status).toBe(200);
            expect(result).toEqual({});
        });
    });
})