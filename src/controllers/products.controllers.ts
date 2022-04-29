import { NextFunction, Request, Response } from 'express';
import { ProductModel } from '../models/product.model';
import { Product } from '../types/product.type';

const productStore = new ProductModel();

// create new user using createUser method from users model
const createProduct = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const newProduct : Product | null = await productStore.createProduct({
            name : req.body.name,
            price : parseInt(req.body.price as string)
        });

        res.json({
            data : { ...newProduct }
        });
    } catch(error) {
        next(error);
    }
}

// get one user info using getUser method from users model by id parameter
const getOneProduct = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const selectedProduct : Product | null = await productStore.getProduct(req.params.id as string);

        res.json({
            data : { ...selectedProduct }
        });
    } catch(error) {
        next(error);
    }
}

// get all users info using getUsers method from users model
const getAllProducts = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const allProducts : Product[] | null = await productStore.getProducts();

        res.json({
            data : { ...allProducts }
        });
    } catch(error) {
        next(error);
    }
}

// update a user info using updateUser method from users model
const updateProduct = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const product : Product | null = await productStore.updateProduct({
            id: req.params.id as unknown as number,
            name: req.body.name,
            price: req.body.price
        });

        res.json({
            data : { ...product }
        });
    } catch(error) {
        next(error);
    }
}

// delete a user using deleteUser method from users model
const deleteOneProduct = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const deleted : Product | null = await productStore.deleteProduct(req.params.id as string);
        
        res.json({
            data : { ...deleted }
        });
    } catch(error) {
        next(error);
    }
}

export default {createProduct, getOneProduct, getAllProducts, updateProduct, deleteOneProduct};