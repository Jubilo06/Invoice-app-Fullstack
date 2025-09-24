import { Router } from "express";
import usersRouter from "./users.mjs";
import invoicesRouter from "./invoices.mjs";

const router = Router();
router.use(usersRouter);
router.use(invoicesRouter);

export default router;
