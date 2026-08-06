import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { createComment, getCommentsByPost,deleteComment,  updateComment } from "../contollers/comment.controller.js"

const router = Router()

router.route("/:postId")
.post(verifyJWT,createComment)
.get(getCommentByPost);

router.route("/:commentId")
    .patch(verifyJWT, updateComment)
    .delete(verifyJWT, deleteComment);

    
export default router;