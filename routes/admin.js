import {Router} from "express";

import validate from "../middlewares/validation.js";
import schemas from "../middlewares/schemas/admin.schema.js";
import authorization from "../middlewares/authorization.js";
import isAdmin from "../middlewares/roleChecker.js";

import controller from "../controllers/adminController.js";
const adminRoutes = Router();

adminRoutes.post('/films',authorization,isAdmin,validate(schemas.addFilm,'body'),controller.addFilm);
adminRoutes.put('/films/:id',authorization,isAdmin,validate(schemas.updateFilm,'body'),validate(schemas.validID,'params'),controller.updateFilm);
adminRoutes.delete('/films/:id',authorization,isAdmin,validate(schemas.validID,'params'),controller.deleteFilm);

export default adminRoutes;