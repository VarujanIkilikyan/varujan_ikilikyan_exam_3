import {Router} from "express";

import validate from "../middlewares/validation.js";
import schemas from "../middlewares/schemas/admin.schema.js";
import authorization from "../middlewares/authorization.js";

import controller from "../controllers/filmController.js";


const filmsRoutes = Router();

filmsRoutes.get('/',authorization,controller.search);
filmsRoutes.get('/showtime',authorization,controller.Showtime);
filmsRoutes.get('/showtime/:id',authorization,validate(schemas.validID,'params'),controller.Showtimebyid);



export default filmsRoutes;