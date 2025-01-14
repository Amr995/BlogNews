const router = require("express").Router();
const {
  sendResetPasswordLinkCtrl,
  getResetPasswordLinkCtrl,
  resetPasswordLinkCtrl
} = require("../controllers/passwordController");

// /api/password/reser-password-link
router.post("/reset-password-link", sendResetPasswordLinkCtrl);

// /api/password/reser-password/:userId/:token
router
  .route("/reser-password/:userId/:token")
  .get(getResetPasswordLinkCtrl)
  .post(resetPasswordLinkCtrl);

module.exports = router;
