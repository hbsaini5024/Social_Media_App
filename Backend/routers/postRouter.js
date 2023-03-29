const router = require("express").Router();
const postController = require("../controllers/postsController");
const requireUser = require("../middlewares/requireUser");

router.post("/", requireUser, postController.createPostController);
router.post("/like", requireUser, postController.likeAndUnlikePostController);
router.put("/updatePost", requireUser, postController.updatePostController);
router.delete("/deletePost", requireUser, postController.deletePostController);

module.exports = router;
