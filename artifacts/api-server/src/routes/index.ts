import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import scanRouter from "./scan";
import styleRouter from "./style";
import socialRouter from "./social";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(scanRouter);
router.use(styleRouter);
router.use(socialRouter);

export default router;
