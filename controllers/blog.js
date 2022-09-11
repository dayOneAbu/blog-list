const blogRouter = require('express').Router();
const Blog = require('../models/Blog');

blogRouter.get('/', async(req, res) => {
	const blogs = await Blog.find({});
	res.json(blogs);
});
blogRouter.get('/:id', async(req, res) => {
	const blog = await Blog.findById(req.params.id);
	if(!blog) {
		return  res.status(404).end();
	}
	res.status(201).json(blog);
});


blogRouter.post('/', async(req, res) => {
	const { title, author, url, likes } = req.body;
	const blog = new Blog({
		title,
		author,
		url,
		likes,
	});

	const result = await blog.save();
	res.status(201).json(result);

});
blogRouter.put('/:id', async(req, res) => {
	const {
		title,
		author,
		url,
		likes,
	} = req.body;
	const result = await Blog.findByIdAndUpdate(req.params.id,
		{
			title,
			author,
			url,
			likes: likes + 1
		},
		{ new: true, runValidators: true, context: 'query' });

	res.status(201).json(result);
});
blogRouter.delete('/:id', async(req, res) => {
	console.log(req.params.id);
	await Blog.findByIdAndRemove(req.params.id);
	res.status(204).end();
});


module.exports = blogRouter;
