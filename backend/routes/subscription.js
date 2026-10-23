import { Router } from "express";
import {
  toggleSubscription,
  checkSubscription,
  getSubscriptions,
  getSubscriberCount
} from "../controller/subscription.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const subscriptionRouter = Router();

subscriptionRouter.post("/toggle/:channelId", authMiddleware, toggleSubscription);
subscriptionRouter.get("/status/:channelId", authMiddleware, checkSubscription);
subscriptionRouter.get("/list", authMiddleware, getSubscriptions);
subscriptionRouter.get("/count/:channelId", getSubscriberCount);

export default subscriptionRouter;
