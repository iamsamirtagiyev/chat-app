const router = require("express").Router();
const user = require("../controllers/userController");

router.get("/profile", user.userInfo);
router.get("/user/:id", user.userDetail);
router.post("/update", user.updateUser);
router.post("/search", user.searchUser);
router.get("/all", user.allUsers);

module.exports = router;
