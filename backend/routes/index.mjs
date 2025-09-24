import { Router } from "express";
import usersRouter from "./users.mjs";
import invoicesRouter from "./invoices.mjs";

const router = Router();
router.use('/api/users',usersRouter);
router.use(invoicesRouter);

export default router;
