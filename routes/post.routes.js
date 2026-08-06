import { Router } from "express"
import { upload } from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/auth.js"
import { createPost } from "../contollers/post.controller.js"
const router = Router()

router
    .route("/")
    .post(
        verifyJWT,
        upload.single("coverImage"),
        createPost
    )

// GET all posts not implemented yet — return 501 until implemented
router.get('/', (req, res) => res.status(501).json({ status: 501, data: null, message: 'Not implemented' }));



router.route("/:id")
    .delete(verifyJWT, deletePost)
    .get(getPostById)
    .patch(verifyJWT, upload.single("coverImage"), updatePost)




export default router;