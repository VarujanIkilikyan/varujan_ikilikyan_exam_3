import HttpErrors from 'http-errors';
import jwt from "jsonwebtoken";
import {UsersModel} from '../models/Index.model.js';


export  default  async (req,res,next)=>{
    try {
        const token = req.cookies.token;

        if (!token) {
            next(HttpErrors(401));
        }
        const {SECRET_KEY} = process.env;

        const user = jwt.verify(token, SECRET_KEY);
        if (!user || !user?.id || !user?.email||!user.role) {
            next(HttpErrors(401));
        }
        if(!(await  UsersModel.findByPk(user.id))) {
            next(HttpErrors(401));
        }

        req.user = user;
        next();

    }catch (e){
        next(HttpErrors(401));
    }

}