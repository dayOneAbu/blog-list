const Blog = require('../models/Blog');
const initialBlogs = [
	{
		'title': 'test post',
		'author': 'him',
		'url': 'http://localhost:3001/1',
		'likes': 3
	},
	{
		'title': 'test post2',
		'author': 'me',
		'url': 'http://localhost:3001/2',
		'likes': 0
	},
	{
		'title': 'test post3',
		'author': 'me',
		'url': 'http://localhost:3001/3',
		'likes': 1
	},

];

const nonExistingId = async () => {
	const post = new Blog({
		'title': 'test post3',
		'author': 'me',
		'url': 'http://localhost:3001/3',
		'likes': 1
	});
	await post.save();
	await post.remove();
	return post.id;
};

const postsInDB = async () => {
	const posts = await Blog.find({});
	return JSON.parse(JSON.stringify(posts));
};

module.exports = {
	initialBlogs, nonExistingId, postsInDB
};