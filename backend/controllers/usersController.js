const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");

/**______________________________________________________
 * @desc Get All Users Profile
 * @route /api/auth/profile
 * @method GET
 * @access private (only admin)
 ______________________________________________________*/
module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});
