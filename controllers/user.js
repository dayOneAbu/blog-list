const userRouter = require('express').Router();
const bcrypt = require('bcryptjs');
// const JWT = require('jsonwebtoken');


const User = require('../models/User');

userRouter.get('/',async(req,res)=>{
	const users = await User.find({}).populate('blogs');
	if(!users){
		return res.status(404).end();
	}
	res.status(200).json(users);
});
userRouter.get('/:id',async(req,res)=>{
	const user = await User.findById(req.params.id);
	if(!user){
		return res.status(404).end();
	}
	res.status(200).json(user);
});
userRouter.post('/',async(req,res)=>{
	const {userName,name,password}= req.body;
	const existingUser = await User.findOne({ userName });
	if (existingUser) {
		return res.status(400).json({
			error: 'userName must be unique'
		});
	}
	if(userName.length <3 || password.length < 3){
		return res.status(400).json({
			error: 'UserName and password must be more than 3 character'
		});
	}
	const salt = 10;
	const hashedPassword = await bcrypt.hash(password, salt);
	const newUser = new User({
		userName,
		name,
		password:hashedPassword
	});
	newUser.save();
	res.status(201).json(newUser);
});
userRouter.delete('/:id',async(req,res)=>{
	await User.findByIdAndRemove(req.params.id);
	res.status(204).end();
});


module.exports = userRouter;