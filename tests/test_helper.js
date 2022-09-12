const Blog = require('../models/Blog');
const User = require('../models/User');
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
];
const initialUsers = [
	{
		'userName':'user',
		'name':'test user',
		'password':'12345'
	},
	{
		'userName':'user1',
		'name':'test user1',
		'password':'12345'
	},
];

const nonExistingBlogId = async () => {
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

const nonExistingUserId = async () => {
	const post = new User({
		'userName':'non existing user',
		'name':'non existing user',
		'password':'12345'

	});
	await post.save();
	await post.remove();
	return post.id;
};
const usersInDB = async () => {
	const users = await User.find({});
	return JSON.parse(JSON.stringify(users));
};

module.exports = {
	initialBlogs,
	nonExistingBlogId,
	usersInDB,
	nonExistingUserId,
	postsInDB,
	initialUsers
};