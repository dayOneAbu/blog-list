const blogRouter = require('express').Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const { userExtractor } = require('../utils/middleware');

blogRouter.get('/', async(req, res) => {
	const blogs = await Blog.find({}).populate('user');
	res.json(blogs);
});
blogRouter.get('/:id', async(req, res) => {
	const blog = await Blog.findById(req.params.id).populate('user');
	if(!blog) {
		return res.status(404).end();
	}
	res.status(201).json(blog);
});

blogRouter.post('/',userExtractor, async(req, res) => {
	const { title, author, url, likes } = req.body;
	const user = await User.findById(req.user);
	const blog = new Blog({
		title,
		author,
		url,
		likes,
		user:user
	});
console.log(req.user);
console.log(user)
	const result = await blog.save();
	user.blogs = user.blogs.concat(result.id);
	await user.save();
	res.status(201).json(result);

});
blogRouter.put('/:id',userExtractor, async(req, res) => {
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
blogRouter.delete('/:id', userExtractor,async(req, res) => {
	const post = await Blog.findById(req.params.id);
	if(!post) return res.status(404).end();
	if(post.user.toString() === req.user){
		await post.delete();
		return res.status(204).end();
	}

});


module.exports = blogRouter;
