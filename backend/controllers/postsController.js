const fs = require("fs");
const path = require("path");
const asynHandler = require("express-async-handler");
const { Post, validateCreatePost } = require("../models/User");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");

/**______________________________________________________
 * @desc Create New Post
 * @route /api/posts
 * @method Post
 * @access private (only loged in user)
 ______________________________________________________*/
module.exports.createPostCtrl = asynHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }

  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_Id,
    },
  });

  res.status(202).json(post);

  fs.unlinkSync(imagePath);
});

/**______________________________________________________
 * @desc Get All Post
 * @route /api/posts
 * @method GET
 * @access public
 ______________________________________________________*/
module.exports.getAllPostsCtrl = asynHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;

  if (pageNumber) {
    posts = await Post.find()
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else if (category) {
    posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else {
    posts = await Post.file()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  }

  res.status(200).json(posts);
});

/**______________________________________________________
 * @desc Get Single Post
 * @route /api/posts/:id
 * @method GET
 * @access public
 ______________________________________________________*/
module.exports.getSinglePostCtrl = asynHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user", [
    "-password",
  ]);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }

  res.status(200).json(posts);
});

/**______________________________________________________
 * @desc Get Posts Count
 * @route /api/posts/count
 * @method GET
 * @access private (only admin or owner of the post)
 ______________________________________________________*/
module.exports.getPostCountCtrl = asynHandler(async (req, res) => {
  const post = await Post.count();
  res.status(200).json(count);
});

/**______________________________________________________
 * @desc Delete Post
 * @route /api/posts/:id
 * @method DELETE
 * @access private (only admin or owner of the post)
 ______________________________________________________*/
module.exports.deletePostCtrl = asynHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }

  if (req.user.isAdmin || req.user.id === post.user.toString()) {
    await Post.findByIdAndDelete(req.params.id);
    await cloudinaryRemoveImage(post.image.publicId);

    res
      .status(200)
      .json({ message: "post has been delete successfully", postId: post._id });
  } else {
    res.status(403).json({ message: "access denied, forbidden" });
  }
});
