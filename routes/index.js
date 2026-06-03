import {Router} from "express";

import views from "../controllers/views.js";
import authRoutes from "./auth.js";
import filmsRoutes from "./films.js";
import commentsRoutes from "./comments.js";
import bookingsRoutes from "./bookings.js";
import adminRoutes from "./admin.js";




const SelectorRouter = new Router();

SelectorRouter.get('/',views.viewRender('index'));
SelectorRouter.use('/auth',authRoutes)
SelectorRouter.use('/films',filmsRoutes)
SelectorRouter.use('/comments',commentsRoutes)
SelectorRouter.use('/bookings',bookingsRoutes)
SelectorRouter.use('/admin',adminRoutes)

export default SelectorRouter;