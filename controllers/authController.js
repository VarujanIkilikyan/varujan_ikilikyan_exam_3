import HttpErrors from 'http-errors';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {UsersModel} from '../models/Index.model.js';


export default {


    async registration(req, res, next) {
        try {
            const {username, fullname, email, password} = req.body;

            if (await UsersModel.findOne({where: {email}})) {

                throw new HttpErrors(422, {
                    message: 'Validation error',
                    errors: {
                        email: 'email is already in use',
                    }
                })
            }
            if (await UsersModel.findOne({where: {username}})) {

                throw new HttpErrors(422, {
                    message: 'Validation error',
                    errors: {
                        email: 'username is already in use',
                    }
                })
            }


            const user = await UsersModel.create(
                {username, fullname, email, password})


            res.json({
                message: 'User created successfully',
                user
            })
        } catch (e) {
            next(e);
        }
    },
    async login(req, res, next) {
        try {
            const {email, password} = req.body;

            let user = await UsersModel.findOne({where: {email}});
            if (!user || !await bcrypt.compare(password, user.getDataValue('password'))) {
                throw new HttpErrors(401, {
                    errors: {
                        email: 'неправильный email или пароль',
                        password: 'неправильный email или пароль',
                    }
                })
            }

            const {SECRET_KEY} = process.env;
            const token = jwt.sign({
                id:user.id,
                email:user.email,
                role:user.role
            }, SECRET_KEY, {expiresIn: '1d'});

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            });

            res.json({
                message: "Login successful",
                user
            })

        } catch (e) {
            next(e);
        }
    },
    async changePassword(req, res, next) {
        try {
            const userData = await UsersModel.findByPk(req.user.id);
            if (!userData) {
                throw new HttpErrors(401, 'ошыбка при загрузке профиля')
            }
            const {oldPassword,newPassword} = req.body;
            userData.getDataValue('password')
            if (!await bcrypt.compare(oldPassword, userData.getDataValue('password'))){
                throw new HttpErrors(401, 'wrong password')
            }

            const Update = await userData.update({password:newPassword})
            if (!Update) {
                throw new HttpErrors(401, 'ошыбка при обнавления профиля')
            }

            res.json({
                message: `данные ползвтеля обнавлены`,
                userData
            })

        } catch (e) {
            next(e);
        }
    },
    async logout(req, res, next) {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/'
            });
            res.redirect('/users/login');

        } catch (err) {
            next(err);
        }
    },
    async profile(req, res, next) {
        try {
            const user = await UsersModel.findByPk(req.user.id);
            if (!user) {
                throw new HttpErrors(401, 'ошыбка при загрузке профиля')
            }

            res.json({
                message: `профил ползвтеля ${user.username}`,
                user
            })

        } catch (e) {
            next(e);
        }
    },
}

