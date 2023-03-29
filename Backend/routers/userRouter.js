const router = require("express").Router();
const userController = require("../controllers/userController");
const requireUser = require("../middlewares/requireUser");

router.post(
  "/follow",
  requireUser,
  userController.followAndUnfollowUserController
);
router.get(
  "/getFeedData",
  requireUser,
  userController.getPostsOfFollowingController
);

router.get("/getMyPosts", requireUser, userController.getMyPostsController);
router.get("/getUserPosts", requireUser, userController.getUserPostsController);
router.delete(
  "/deleteMyProfile",
  requireUser,
  userController.deleteMyProfileController
);

router.get("/getMyInfo", requireUser, userController.getMyInfoController);
router.put("/", requireUser, userController.updateUserProfileController);
router.post(
  "/getUserProfile",
  requireUser,
  userController.getUserProfileController
);

module.exports = router;
