import { User } from "../../../types/user.type";
import client from "../../../database";
import { beforeAndAfter } from "../../models/usersModelSpec";
import app from "../../../index";
import supertest from "supertest";

const request = supertest(app);
let token = '';

describe('Test User API Endpoints', async () => {
    const user : User = {
        first_name: 'Mohamed',
        last_name: 'Abotalb',
        password: 'password123456789'
    }

    beforeAndAfter(user);

    describe('Test Authenticate method', () => {
        it('should authenticate to get the user token', async () => {
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

        it('should not authenticate with wrong info', async () => {
            const response = await request
                .post('/api/users/authenticate')
                .set('Content-type', 'application/json')
                .send({
                    first_name: 'Ahmed',
                    password: 'password123456789'
                });
            expect(response.status).toBe(401); 
        });
    });

    describe('Test CRUD API Methods', () => {

        it('should create a new user', async () => {
            const response = await request 
                .post('/api/users/create')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(user);
            const { first_name, last_name } = response.body.data;
            expect(response.status).toBe(200);
            expect(first_name).toBe("Mohamed");
            expect(last_name).toBe("Abotalb");
        });

        it('should get a list of users', async () => {
            const response = await request 
                .get('/api/users')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            const result = response.body.data;
            expect(response.status).toBe(200);
            expect(Object.keys(result).length).toBe(2);
        });

        it('should get user info', async () => {
            const response = await request 
                .get(`/api/users/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            const { first_name, last_name } = response.body.data;
            expect(response.status).toBe(200);
            expect(first_name).toBe(user.first_name);
            expect(last_name).toBe(user.last_name);
        });

        it('should update user info', async () => {
            const response = await request 
                .patch(`/api/users/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...user,
                    first_name: "Nader"
                })
            const { first_name, last_name } = response.body.data;
            expect(response.status).toBe(200);
            expect(first_name).toBe("Nader");
            expect(last_name).toBe("Abotalb");
        });

        it('should delete user', async () => {
            const response = await request 
                .delete(`/api/users/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            const result = response.body.data;
            expect(result).toEqual({});
        });
    });
})