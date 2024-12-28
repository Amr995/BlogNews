const fs = require("fs");
const path = require("path");
const asynHandler = require("express-async-handler");
const { Post, validateCreatePost } = require("../models/User");
const { cloudinaryUploadImage} = require("../utils/cloudinary");


/**______________________________________________________
 * @desc Create New Post
 * @route /api/posts
 * @method Post
 * @access private (only loged in user)
 ______________________________________________________*/
module.exports.createPostCtrl = asynHandler(async (req, res) => {
    if(!req.file) {
        return res.status(400).json({ message: "no image provided"});
    }

    const { error } = validateCreatePost(req.body);
    if(error) {
        return res.status(400).json({ message: error.details[0].message })
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
        }
    });

    res.status(202).json(post);

    fs.unlinkSync(imagePath);

});