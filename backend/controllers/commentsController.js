const asynHandler = require("express-async-handler");
const {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} = require("../models/Comment");
const { User } = require("../models/User");

/**______________________________________________________
 * @desc Create New Comment
 * @route /api/comments
 * @method POST
 * @access private (only loged in user)
 ______________________________________________________*/
module.exports.createCommentCtrl = asynHandler(async (req, res) => {
  const { error } = validateCreateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const profile = await User.findById(req.user.id);

  const comment = await Comment.create({
    postId: req.body.postId,
    text: req.body.text,
    user: req.user.id,
    username: profile.username,
  });

  res.status(201).json(comment);
});

/**______________________________________________________
 * @desc Get All Comments
 * @route /api/comments
 * @method GET
 * @access private (only admin)
 ______________________________________________________*/
module.exports.getAllCommentsCtrl = asynHandler(async (req, res) => {
  const comments = await Comment.find().populate("user");

  res.status(201).json(comment);
});

/**______________________________________________________
 * @desc Delete Comment
 * @route /api/comments/:id
 * @method DELETE
 * @access private (only admin or owner of the comment)
 ______________________________________________________*/
module.exports.deleteCommentCtrl = asynHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({ message: "comment not found" });
  }

  if (req.user.isAdmin || req.user.id === comment.user.toString()) {
    await Comment.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "comment has been delete" });
  } else {
    res.status(403).json({ message: "access denied, not allowed" });
  }
});

/**______________________________________________________
 * @desc Update Comment
 * @route /api/comments/:id
 * @method PUT
 * @access private (only owner of the comment)
 ______________________________________________________*/

module.exports.updateCommentCtrl = asynHandler(async (req, res) => {
  const { error } = validateUpdateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "comment not found" });
  }

  if (req.user.id !== comment.user.toString()) {
    return res
      .status(403)
      ._construct.json({
        message: "access deied, only user himself can edit his comment",
      });
  }

  const updateComment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        text: req.body.text,
      },
    },
    { new: true }
  );
  res.status(200).json(updateComment);
});
