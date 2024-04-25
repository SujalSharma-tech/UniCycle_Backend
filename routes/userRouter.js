import {
  login,
  logout,
  register,
  getMyProfile,
} from "../Controllers/userController.js";
import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getmyprofile", isAuthenticated, getMyProfile);

export default router;
