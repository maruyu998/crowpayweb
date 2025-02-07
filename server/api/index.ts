import express from "express";
import v1ApiRouter from "./v1/index";

const router = express.Router();

router.use("/v1", v1ApiRouter);

export default router;