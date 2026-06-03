import {Router} from "express";


import validate from "../middlewares/validation.js";
import schemas from "../middlewares/schemas/auth.schema.js";
import authorization from "../middlewares/authorization.js";

import views from "../controllers/views.js";
import controller from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.get('/register',views.viewRender('register'));
authRoutes.post('/register',validate(schemas.register,'body'),controller.registration);

authRoutes.get('/login',views.viewRender('login'));
authRoutes.post('/login',validate(schemas.login,'body'),controller.login);
authRoutes.get('/logout',controller.logout);

authRoutes.get('/profile',authorization,controller.profile);
authRoutes.put('/profile/changePassword',authorization,validate(schemas.changePassword,'body'),controller.changePassword);


export default authRoutes;