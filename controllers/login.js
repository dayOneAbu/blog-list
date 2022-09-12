const loginRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = require('../models/User');
const { SECRET } = require('../utils/config');

loginRouter.post('/',async(req,res)=>{
	const {userName,password} = req.body;
	const user = await User.findOne({userName});

	if(!user) return res.status(404).json({
		error: 'invalid userName or password'
	});
	const isMatch = await bcrypt.compare(password,user.password);
	if(!isMatch) return res.status(401).json({
		error: 'invalid userName or password'
	});
	const payload = {
		userName:user.userName,
		id:user.id
	};
	const token = jwt.sign(payload, SECRET,{ expiresIn: 60*60 });
	res
		.status(200)
		.send(token );
});

module.exports = loginRouter;