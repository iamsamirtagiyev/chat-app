const router = require("express").Router();
const auth = require("../controllers/authController");
const hashPassword = require("../middlewares/hash-password");

router.post("/register", hashPassword, auth.register);
router.post("/login", auth.login);
router.get("/logout", auth.logout);

module.exports = router;
