const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage
} = require("../utils/cloudinary");
const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");

/**______________________________________________________
 * @desc Get All Users Profile
 * @route /api/auth/profile
 * @method GET
 * @access private (only admin)
 ______________________________________________________*/
module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").populate("posts");
  res.status(200).json(users);
});

/**______________________________________________________
 * @desc Get User Profile
 * @route /api/auth/profile/:id
 * @method GET
 * @access public
 ______________________________________________________*/
module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("posts");
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  res.status(200).json(user);
});

/**______________________________________________________
 * @desc Update User Profile
 * @route /api/auth/profile/:id
 * @method PUT
 * @access private (only user himself)
 ______________________________________________________*/
module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.passwaord, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        boi: req.body.boi,
      },
    },
    { new: true }
  ).select("-password");

  res.status(200).json(updatedUser);
});

/**______________________________________________________
 * @desc Get Users Count
 * @route /api/auth/count
 * @method GET
 * @access private (only admin)
 ______________________________________________________*/
module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
  const count = await User.count();
  res.status(200).json(count);
});

/**______________________________________________________
 * @desc Profile Photo Uplode
 * @route /api/auth/profile/profile-photo-upload
 * @method POST
 * @access private (only logged in user)
 ______________________________________________________*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "no file provided" });
  }

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  const result = await cloudinaryUploadImage(imagePath);

  const user = await User.findById(req.user.id);

  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();

  res.status(200).json({
    message: "your profile photo uploaded successfully",
    profilePhoto: { url: result.secure_url, publicId: result.public_id },
  });

  fs.unlinkSync(imagePath);
});

/**______________________________________________________
 * @desc Delete User Profile (Account)
 * @route /api/auth/profile/:id
 * @method DELETE
 * @access private (only admin of user himself)
 ______________________________________________________*/
module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const posts = await Post.find({ user: user._id});

  const publicIds = posts?.map((post) => post.image.publicId);

  if(publicIds?.length > 0) {
    await cloudinaryRemoveMultipleImage(publicIds);
  }

  await cloudinaryRemoveImage(user.profilePhoto.publicId);

  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "your profile has been deleted" });
});
