import { OrdersModel } from "../../models/order.model";
import { UserModel } from "../../models/users.model";
import { ProductModel } from "../../models/product.model";
import { Order } from "../../types/order.type";
import client from "../../database";
import { User } from "../../types/user.type";
import { Product } from "../../types/product.type";

const store = new OrdersModel();
const userStore = new UserModel();
const productStore = new ProductModel();

describe("Order Model", () => {
    describe("Order Model CRUD Methods Existing", () => {
        it('should have a getOrders method', () => {
            expect(store.getOrders).toBeDefined();
        });

        it('should have a getOrder method', () => {
            expect(store.getOrder).toBeDefined();
        });

        it('should have a createOrder method', () => {
            expect(store.createOrder).toBeDefined();
        });

        it('should have a deleteOrder method', () => {
            expect(store.deleteOrder).toBeDefined();
        });

        it('should have a updateOrder method', () => {
            expect(store.updateOrder).toBeDefined();
        });

        it('should have a addProduct method', () => {
            expect(store.addProduct).toBeDefined();
        });
    })

    describe("Test Order Model Functionality", () => {
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
            user_id: "1",
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
            const productSQL : string = 'DELETE FROM products;\nALTER SEQUENCE products_id_seq RESTART WITH 1;';
            const userSQL : string = 'DELETE FROM users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;';
            await connection.query(sql);
            await connection.query(userSQL);
            await connection.query(productSQL);
            connection.release();
        });
    
        it('create method should add an order', async () => {
            const result = await store.createOrder({
                user_id: "1",
                status: 'open'
            });
            expect(result.user_id.toString()).toEqual(order.user_id);
            expect(result.status).toEqual(order.status);
        });
        
        it('getOrders method should return a list of Orders', async () => {
            const result = await store.getOrders();
            expect(Object.keys(result).length).toEqual(2);
        });

        it('getOrder method should return the correct order with its id', async () => {
            const result = await store.getOrder(order.id as unknown as string);
            expect(result.user_id.toString()).toEqual(order.user_id);
            expect(result.status).toEqual(order.status);
        });

        it('addProduct method should allow the user to add a product to order if its status is open', async () => {
            const result : Order | undefined = await store.addProduct(product.id as unknown as string, order.id as unknown as string, order.quantity as number)
            expect(result.id).toEqual(order.id);
            expect(result.product_id).toEqual(order.product_id);
            expect(result.quantity).toEqual(order.quantity);
        })

        it('updateOrder method should update the order info', async () => {
            const result = await store.updateOrder({
                ...order,
                status : "closed"
            });
            expect(result.status).toBe("closed");
        });

        it('addProduct method should not allow the user to add a product to order if its status is closed', async () => {
            const result = await store.addProduct(order.product_id as string, order.id as unknown as string, 4)
            expect(result).toBeUndefined()
        })

        it('delete method should remove the order', async () => {
            const result = await store.deleteOrder(order.id as unknown as string);
            expect(result).toBeUndefined();
        });

    })
});