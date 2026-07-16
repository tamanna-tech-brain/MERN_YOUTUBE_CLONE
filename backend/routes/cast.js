import { Router } from "express";
import * as castController from "../controller/cast.js";
import { validate } from "../middleware/validate.js";
import { castSchema, updateCastSchema } from "../validators/castValidators.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const castRouter = Router();

castRouter.post("/create", authMiddleware, validate(castSchema), castController.createCast);
castRouter.get("/get", castController.getCasts);
castRouter.get("/get/:id", castController.getCastById);
castRouter.put("/update/:id", authMiddleware, validate(updateCastSchema), castController.updateCastById);
castRouter.delete("/delete/:id", authMiddleware, castController.deleteCastById);

export default castRouter;