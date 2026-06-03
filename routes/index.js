import {Router} from "express";

import views from "../controllers/views.js";
import authRoutes from "./auth.js";
import filmsRoutes from "./filmsRoutes.js";
import commentsRoutes from "./commentsRoutes.js";
import bookingsRoutes from "./bookingsRoutes.js";
import adminRoutes from "./adminRoutes.js";




const SelectorRouter = new Router();

SelectorRouter.get('/',views.viewRender('index'));
SelectorRouter.use('/auth',authRoutes)
SelectorRouter.use('/films',filmsRoutes)
SelectorRouter.use('/comments',commentsRoutes)
SelectorRouter.use('/bookings',bookingsRoutes)
SelectorRouter.use('/admin',adminRoutes)

export default SelectorRouter;