import { Router } from "express"
import { upload } from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/auth.js"
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from "../contollers/post.controller.js"
const router = Router()

router
    .route("/")
    .post(
        verifyJWT,
        upload.single("coverImage"),
        createPost
    )
    .get(getAllPosts)



router.route("/:id")
    .delete(verifyJWT, deletePost)
    .get(getPostById)
    .patch(verifyJWT, upload.single("coverImage"), updatePost)




export default router;