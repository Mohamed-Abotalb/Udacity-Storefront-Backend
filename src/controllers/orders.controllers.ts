import { NextFunction, Request, Response } from 'express';
import { OrdersModel } from '../models/order.model';
import { Order } from '../types/order.type';

const orderStore = new OrdersModel();

// create new order using createOrder method from orders model
const createOrder = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const newOrder : Order | null = await orderStore.createOrder({
            user_id : req.body.user_id,
            status : req.body.status
        });

        res.json({
            data : { ...newOrder }
        });
    } catch(error) {
        next(error);
    }
}

// get one order info using getOrder method from orders model by id parameter
const getOneOrder = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const selectedOrder : Order | null = await orderStore.getOrder(req.params.id as string);

        res.json({
            data : { ...selectedOrder }
        });
    } catch(error) {
        next(error);
    }
}

// get all orders info using getOrders method from orders model
const getAllOrders = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const allOrders : Order[] | null = await orderStore.getOrders();

        res.json({
            data : { ...allOrders }
        });
    } catch(error) {
        next(error);
    }
}

// update an order info using updateOrder method from orders model
const updateOneOrder = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const order : Order | null = await orderStore.updateOrder({
            id: req.params.id as unknown as number,
            user_id: req.body.user_id,
            status: req.body.status
        });

        res.json({
            data : { ...order }
        });
    } catch(error) {
        next(error);
    }
}

// delete an order using deleteOrder method from orders model
const deleteOneOrder = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const deleted : Order | null = await orderStore.deleteOrder(req.params.id as string);
        
        res.json({
            data : { ...deleted }
        });
    } catch(error) {
        next(error);
    }
}

const addProduct = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const productId : string = req.body.product_id;
        const orderId : string = req.params.id;
        const quantity : number = parseInt(req.body.quantity as string);

        const order : Order | null = await orderStore.addProduct(productId, orderId, quantity);
        
        res.json({
            data : { ...order }
        });
    } catch(error) {
        next(error);
    }
}

export default {createOrder, getOneOrder, getAllOrders, updateOneOrder, deleteOneOrder, addProduct};