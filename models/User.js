const  mongoose = require('mongoose');

const  userSchema = new mongoose.Schema({
	userName:{
		type:String,
		required:true,
		unique:true
	},
	name:{
		type:String,
		required:true,
	},
	password:{
		type:String,
		required:true,
	},
	blogs:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:'Blog'
		}
	],
});

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.password;
	}
});

module.exports = mongoose.model('User',userSchema);