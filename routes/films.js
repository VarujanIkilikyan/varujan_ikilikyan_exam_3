import {Router} from "express";

import validate from "../middlewares/validation.js";
import schemas from "../middlewares/schemas/auth.schema.js";
import authorization from "../middlewares/authorization.js";

import controller from "../controllers/filmController.js";


const filmsRoutes = Router();

filmsRoutes.get('/',authorization,controller.search);

export default filmsRoutes;