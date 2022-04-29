import { ProductModel } from "../../models/product.model";
import { Product } from "../../types/product.type";
import client from "../../database";

const store = new ProductModel();

describe("Product Model", () => {
    describe("Product Model CRUD Methods Existing", () => {
        it('should have a getProducts method', () => {
            expect(store.getProducts).toBeDefined();
        });

        it('should have a getProduct method', () => {
            expect(store.getProduct).toBeDefined();
        });

        it('should have a createProduct method', () => {
            expect(store.createProduct).toBeDefined();
        });

        it('should have a deleteProduct method', () => {
            expect(store.deleteProduct).toBeDefined();
        });

        it('should have a updateProduct method', () => {
            expect(store.updateProduct).toBeDefined();
        });
    })

    describe("Test Product Model Functionality", () => {
        const product : Product = {
            name: 'coffee',
            price: 5
        }

        beforeAll(async () => {
            const createdProduct : Product | null = await store.createProduct(product);
            product.id = createdProduct.id;
        });
        
        afterAll(async () => {
            const connection = await client.connect();
            const sql : string = 'DELETE FROM products;\nALTER SEQUENCE products_id_seq RESTART WITH 1;';
            await connection.query(sql);
            connection.release();
        });
    
        it('create method should add a product', async () => {
            const result = await store.createProduct({
                name : "mint",
                price : 4
            });
            expect(result).toEqual({
                id: result.id,
                name: "mint",
                price: 4,
            });
        });
        
        it('getProducts method should return a list of Products', async () => {
            const result = await store.getProducts();
            expect(result.length).toEqual(2);
        });

        it('getProduct method should return the correct product with its id', async () => {
            const result = await store.getProduct(product.id as unknown as string);
            expect(result.id).toEqual(product.id);
            expect(result.name).toEqual(product.name);
            expect(result.price).toEqual(product.price);
        });

        it('updateProduct method should update the product info', async () => {
            const result = await store.updateProduct({
                ...product,
                name : "tea",
                price : 10
            });
            expect(result.id).toBe(product.id);
            expect(result.name).toBe("tea");
            expect(result.price).toBe(10);
        });

        it('delete method should remove the product', async () => {
            const result = await store.deleteProduct(product.id as unknown as string);
            expect(result).toBeUndefined();
        });
    })
});