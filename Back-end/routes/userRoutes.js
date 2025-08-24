import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile/update/:id", authMiddleware, userController.updateProfile);


router.get("/user/list", authMiddleware, roleMiddleware(["admin"]), userController.getAllUsers);
router.post("/user", authMiddleware, roleMiddleware(["admin"]), userController.addUser);
router.put("/user/:id", authMiddleware, roleMiddleware(["admin"]), userController.updateUser);
router.delete("/user/:id", authMiddleware, roleMiddleware(["admin"]), userController.deleteUser);

export default router;
