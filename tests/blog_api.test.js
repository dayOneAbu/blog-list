const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/Blog');
const { initialBlogs, postsInDB, nonExistingId } = require('./test_helper');

const api = supertest(app);


beforeEach(async () => {
	await Blog.deleteMany({});
	console.log('cleared');
	await Blog.insertMany(initialBlogs);
	console.log('added');

},100000);

describe('when there is initial posts',()=>{
	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs/')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});
	test('all blog posts in DB returned', async () => {
		const response = await api.get('/api/blogs/');
		expect(response.body).toHaveLength(initialBlogs.length);
	});
	test('a specific post is within the returned Blog Posts', async () => {
		const response = await api.get('/api/blogs/');
		const author = response.body.map(post => post.author);
		expect(author).toContain('him');
	});
});

describe('retrieving a single post',()=>{
	test('succeeds with a valid id', async () => {
		const posts = await postsInDB();
		await api.get(`/api/blogs${posts[0].id}}`);
		expect(200);
	});
	test('fails with a invalid id', async () => {
		const postWithInvalidID = await nonExistingId();
		await api.get(`/api/blogs${postWithInvalidID}`);
		expect(400);
	});
});

describe('creating new posts',()=>{
	test('a valid Blog can be added', async () => {
		const newPost = {
			'title': 'test post4',
			'author': 'someone else',
			'url': 'http://localhost:3001/4',
			'likes': 1

		};
		await api
			.post('/api/blogs')
			.send(newPost)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const posts = await postsInDB();
		expect(posts).toHaveLength(initialBlogs.length + 1);
	});
	test('post without a like can be added with default value 0',async ()=>{
		const newPost = {
			'title': 'test post4',
			'author': 'someone else',
			'url': 'http://localhost:3001/4',
		};
		await api
			.post('/api/blogs')
			.send(newPost)
			.expect(201);
		const posts = await postsInDB();
		expect(posts).toHaveLength(initialBlogs.length + 1);
	},100000);
	test('post without title/url can not be added backend responds with status code 400 Bad Request.',async ()=>{
		const newPost = {
			'title': 'test post4',
			'author': 'someone else',
		};
		await api
			.post('/api/blogs')
			.send(newPost)
			.expect(400);
		const posts = await postsInDB();
		expect(posts).toHaveLength(initialBlogs.length);
	},100000);
});
describe('deletion of a post',()=>{
	test('succeeds with a valid id', async () => {
		const postsAtStart = await postsInDB();
		await api.delete(`/api/blogs/${postsAtStart[0].id}`);
		expect(204);
		const postsAtEnd = await postsInDB();
		expect(postsAtEnd).toHaveLength(initialBlogs.length - 1);
	});
	test('fails with a invalid id', async () => {
		const postWithInvalidID = await nonExistingId();
		await api.delete(`/api/blogs/${postWithInvalidID}`);
		expect(400);
	});
});
describe('modifying of a post',()=>{
	test('succeeds with a valid id', async () => {
		const before = await postsInDB();
		const after = await api.put(`/api/blogs/${before[0].id}`).send(before[0]).expect(201);
		expect(after.body.likes).toEqual(before[0].likes + 1);
	});
	test('fails with a invalid id', async () => {
		const postWithInvalidID = await nonExistingId();
		await api.delete(`/api/blogs/${postWithInvalidID}`);
		expect(400);
	});
});
afterAll(() => {
	mongoose.connection.close();
});