import { Router } from "express";
import *as historycontroller from "../controller/history.js"
import { validate } from "../middleware/validate.js";
import { historySchema } from "../validators/historyValidator.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const historyRouter = Router();

historyRouter.post("/watch/:movieId", authMiddleware,  validate(historySchema, "params"), historycontroller.watchMovie)
historyRouter.get("/", authMiddleware, historycontroller.getHistory)
export default historyRouter;