import express from "express";

import {
  DeletePost,
  GetAllItems,
  ItemPost,
  getMyItems,
  getSingleItem,
  updatePost,
} from "../Controllers/itemController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, ItemPost);
router.delete("/delete/:id", isAuthenticated, DeletePost);
router.get("/posts", GetAllItems);
router.get("/getsingleitem/:id", getSingleItem);
router.get("/getmyitems", isAuthenticated, getMyItems);
router.put("/updatepost/:id", isAuthenticated, updatePost);

export default router;
