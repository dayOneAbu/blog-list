const blogRouter = require("express").Router();
const Blog = require("../models/Blog");

blogRouter.get("/", (req, res) => {
	Blog.find({}).then((blogs) => {
		res.json(blogs);
	});
});

blogRouter.post("/", (req, res) => {
	const { title, author, url, likes } = req.body;
	const blog = new Blog({
		title,
		author,
		url,
		likes,
	});

	blog.save().then((result) => {
		res.status(201).json(result);
	});
});
module.exports = blogRouter;
