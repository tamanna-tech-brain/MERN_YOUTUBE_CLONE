import { Router } from "express";
import { createComment, getCommentsByMovie, deleteComment } from "../controller/comment.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const commentRouter = Router();

commentRouter.get("/:movieId", getCommentsByMovie);
commentRouter.post("/:movieId", authMiddleware, createComment);
commentRouter.delete("/:id", authMiddleware, deleteComment);

export default commentRouter;
