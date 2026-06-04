import {Router} from "express";

import validate from "../middlewares/validation.js";
import schemas from "../middlewares/schemas/auth.schema.js";
import authorization from "../middlewares/authorization.js";

import controller from "../controllers/adminController.js";
const adminRoutes = Router();

adminRoutes.post('/films',authorization,controller.addFilm);
adminRoutes.put('/films',authorization,controller.updateFilm);
adminRoutes.delete('/films',authorization,controller.deleteFilm);

export default adminRoutes;