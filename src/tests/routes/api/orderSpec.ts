import { OrdersModel } from "../../../models/order.model";
import { UserModel } from "../../../models/users.model";
import { ProductModel } from "../../../models/product.model";
import { Order } from "../../../types/order.type";
import { User } from "../../../types/user.type";
import { Product } from "../../../types/product.type";
import client from "../../../database";
import app from "../../../index";
import supertest from "supertest";

const store = new OrdersModel();
const userStore = new UserModel();
const productStore = new ProductModel();
const request = supertest(app);
let token = '';

describe('Test Order API Endpoints', async () => {
    const user : User = {
        first_name: 'Mohamed',
        last_name: 'Abotalb',
        password: 'password123456789'
    }

    const product : Product = {
        name: 'coffee',
        price: 5
    }

    const order : Order = {
        product_id: "1",
        user_id: "1",
        quantity: 2,
        status: 'open'
    }

    beforeAll(async () => {
        const createdUser : User | null = await userStore.createUser(user);
        user.id = createdUser.id;

        const createdProduct : Product | null = await productStore.createProduct(product);
        product.id = createdProduct.id;

        const createdOrder : Order | null = await store.createOrder(order);
        order.id = createdOrder.id;
    });
    
    afterAll(async () => {
        const connection = await client.connect();
        const sql : string = 'DELETE FROM orders;\nALTER SEQUENCE orders_id_seq RESTART WITH 1;';
        const sqlUser : string = 'DELETE FROM users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;';
        const sqlProduct : string = 'DELETE FROM products;\nALTER SEQUENCE products_id_seq RESTART WITH 1;';
        await connection.query(sql);
        await connection.query(sqlUser);
        await connection.query(sqlProduct);
        connection.release();
    });

    describe('Test CRUD API Methods', () => {
        it('should authenticate to get the user token to be able to create order', async () => {
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

        it('should create a new order', async () => {
            const response = await request 
                .post('/api/orders/create')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(order);
            const { status } = response.body.data;
            expect(response.status).toBe(200);
            expect(status).toBe(order.status);
        });

        it('should get a list of orders', async () => {
            const response = await request 
                .get('/api/orders')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            const result = response.body.data;
            expect(response.status).toBe(200);
            expect(Object.keys(result).length).toBe(2);
        });

        it('should get order info', async () => {
            const response = await request 
                .get(`/api/orders/${order.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            const {status } = response.body.data;
            expect(response.status).toBe(200);
            expect(status).toBe(order.status);
        });

        it('should allow the user to add a product to order if its status is open', async () => {
            const response = await request 
                .post(`/api/orders/${order.id}/products`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    product_id: order.product_id,
                    order_id: order.id,
                    quantity: order.quantity
                })
            expect(response.status).toBe(200);
        });

        it('should update order info', async () => {
            const response = await request 
                .patch(`/api/orders/${order.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_id: order.user_id,
                    status: 'closed'
                })
            const {status } = response.body.data;
            expect(response.status).toBe(200);
            expect(status).toBe('closed');
        });

        it('should not allow the user to add a product to order if its status is closed', async () => {
            const response = await request 
                .post(`/api/orders/${order.id}/products`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    product_id: order.product_id,
                    order_id: order.id,
                    quantity: order.quantity
                })
            const result = response.body.data;
            console.log(result);
            expect(response.status).toBe(404);
            expect(result).toBeUndefined()
        });

        it('should delete order', async () => {
            const response = await request 
                .delete(`/api/orders/${order.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            const result= response.body.data;
            expect(response.status).toBe(200);
            expect(result).toEqual({});
        });
    });
});