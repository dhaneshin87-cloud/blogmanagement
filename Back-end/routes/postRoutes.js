import express from "express";
import postController from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// public
router.get("/post/list", authMiddleware, postController.getAllPosts);

// User with specific id → get posts by userId
router.get("/post/list/:id", authMiddleware, postController.getAllPosts);

// user/admin
router.post("/post/create", authMiddleware, postController.createPost);

// single post
router.get("/post/:id", authMiddleware, postController.getPost);
router.put("/post/update/:id", authMiddleware, postController.updatePost);
router.delete("/post/delete/:id", authMiddleware, postController.deletePost);

export default router;
