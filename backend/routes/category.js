import { Router } from "express";
import { validate } from "../middleware/validate.js";
import *as categorycontroller from "../controller/category.js"
import { categorySchema, updateCategorySchema } from "../validators/categoryValidator.js"
import { authMiddleware } from "../middleware/authMiddleware.js";
const categoryRouter = Router();

categoryRouter.post("/create", authMiddleware, validate(categorySchema), categorycontroller.createCategory)
categoryRouter.get("/get", categorycontroller.getCategory)
categoryRouter.get("/get/:id", categorycontroller.getCategoryById)
categoryRouter.put("/update/:id", authMiddleware, validate(updateCategorySchema), categorycontroller.updateCategoryById)
categoryRouter.delete("/delete/:id", authMiddleware, categorycontroller.deleteCategoryById)
export default categoryRouter;