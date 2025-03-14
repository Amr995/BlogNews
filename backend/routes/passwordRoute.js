const router = require("express").Router();
const {
  sendResetPasswordLinkCtrl,
  getResetPasswordLinkCtrl,
  resetPasswordCtrl
} = require("../controllers/passwordController");

// /api/password/reser-password-link
router.post("/reset-password-link", sendResetPasswordLinkCtrl);

// /api/password/reser-password/:userId/:token
router
  .route("/reset-password/:userId/:token")
  .get(getResetPasswordLinkCtrl)
  .post(resetPasswordCtrl);

module.exports = router;
