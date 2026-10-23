import { Router } from "express";
import { downloadMovie, getDownloads } from "../controller/download.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { downloadSchema } from "../validators/downloadValidators.js";

const downloadRouter = Router();

downloadRouter.post("/:movieId", authMiddleware, validate(downloadSchema, "params"), downloadMovie);

downloadRouter.get("/", authMiddleware, getDownloads);

export default downloadRouter;