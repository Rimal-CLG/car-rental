import express from "express";
import { webhookController } from "../controllers/webhook.controller.js";

const webhookRouter = express.Router();

webhookRouter.post("", webhookController);

export default webhookRouter;
