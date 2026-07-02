import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import adminRouter from "./admin";
import recordsRouter from "./records";
import salesRouter from "./sales";
import incubationRouter from "./incubation";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(adminRouter);
router.use(recordsRouter);
router.use(salesRouter);
router.use(incubationRouter);

export default router;
