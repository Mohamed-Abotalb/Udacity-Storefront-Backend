import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/users.model';
import { User } from '../types/user.type';
import jwt from 'jsonwebtoken';
import config from '../config';

const user = new UserModel();

// create new user using createUser method from users model
const createUser = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const newUser : User | null = await user.createUser({
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            password : req.body.password
        });

        res.json({
            data : { ...newUser }
        });
    } catch(error) {
        next(error);
    }
}

// get one user info using getUser method from users model by id parameter
const getOneUser = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const selectedUser : User | null = await user.getUser(req.params.id as string);

        res.json({
            data : { ...selectedUser }
        });
    } catch(error) {
        next(error);
    }
}

// get all users info using getUsers method from users model
const getAllUsers = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const allUsers : User[] | null = await user.getUsers();

        res.json({
            data : { ...allUsers }
        });
    } catch(error) {
        next(error);
    }
}

// update a user info using updateUser method from users model
const updateUser = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const updatedUser : User | null = await user.updateUser({
            id: req.params.id as unknown as number,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password
        });

        res.json({
            data : { ...updatedUser }
        });
    } catch(error) {
        next(error);
    }
}

// delete a user using deleteUser method from users model
const deleteOneUser = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const deleted : User | null = await user.deleteUser(req.params.id as string);
        
        res.json({
            data : { ...deleted }
        });
    } catch(error) {
        next(error);
    }
}

// authenticate a user using authenticate method from users model
const authenticate = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const { first_name, password } = req.body;

        const authUser : User | null = await user.authenticate(first_name, password);

        const token = jwt.sign({authUser}, config.tokenSecret as string);

        if (!authUser) {
            return res.status(401).json({
                "status": "error",
                "message": "the username and password don't match please try again"
            });
        }
        return res.json({
            data: { ...authUser, token}
        });

    } catch(error) {
        next(error);
    }
}

export default {createUser, getOneUser, getAllUsers, updateUser, deleteOneUser, authenticate};