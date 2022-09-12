const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/User');
const {  initialUsers, usersInDB } = require('./test_helper');

const api = supertest(app);


beforeEach(async () => {
	await User.deleteMany({});
	console.log('cleared');
	await User.insertMany(initialUsers);
	console.log('added');

},100000);


describe('creating new user',()=>{
	test('a valid user can be added', async () => {
		const newUser = {
			'userName':'valid user',
			'name':'test user1',
			'password':'12345'
		};
		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const users = await usersInDB();
		expect(users).toHaveLength(initialUsers.length + 1);
	});
	test('an invalid user can not be added', async () => {
		const newUser = {
			'userName':'invalid user',
			'name':'test user1',
			'password':'12'
		};
		await api
			.post('/api/users')
			.send(newUser)
			.expect(400);

		const users = await usersInDB();
		expect(users).toHaveLength(initialUsers.length);
	});
});

afterAll(()=>{
	mongoose.connection.close();
});