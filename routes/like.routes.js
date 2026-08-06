import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { likeItem, unlikeItem, getLikesByItem } from "../contollers/like.controller.js";

const router = Router();

router.route("/:itemType/:itemId")
    .post(verifyJWT, likeItem)
    .delete(verifyJWT, unlikeItem)
    .get(getLikesByItem);

export default router;
