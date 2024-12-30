const asynHandler = require("express-async-handler");
const { Category, validateCreateCategory } = require("../models/Category");

/**______________________________________________________
 * @desc Create New Comment
 * @route /api/comments
 * @method POST
 * @access private (only loged in user)
 ______________________________________________________*/
module.exports.createCategoryCtrl = asynHandler(async (req, res) => {
  const { error } = validateCreateCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const category = await Category.create({
    title: res.body.title,
    user: req.user.id,
  });

  res.status(201).json(category);
});

/**______________________________________________________
 * @desc Get All Categories
 * @route /api/categories
 * @method GET
 * @access public
 ______________________________________________________*/
module.exports.getAllCategoriesCtrl = asynHandler(async (req, res) => {
  const categories = await Category.find();

  res.status(200).json(categories);
});

/**______________________________________________________
 * @desc Delete Category
 * @route /api/categories/:id
 * @method DELETE
 * @access private (only admin)
 ______________________________________________________*/
module.exports.deleteCategoryCtrl = asynHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "category not found" });
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: 'category has been deleted successfully',
    categoryId: category._id,
  });
});
