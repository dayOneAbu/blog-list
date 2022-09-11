/* eslint-disable no-mixed-spaces-and-tabs */
const _ = require('lodash');
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {

};
const totalLikes  = (blogPosts)=>{
	return blogPosts.length ===0 ?  0 : blogPosts.reduce((accumulator,{likes})=>{return accumulator+=likes;},0);
};
const favoriteBlog   = (blogPosts)=>{
	return _.maxBy(blogPosts, 'likes');
};

const mostBlogs =  _.flow(
	blogs =>  _.countBy(blogs, 'author'),
	_.toPairs,
	blogs =>  _.maxBy(blogs,  _.last),
	blog => _.zipObject(['author', 'blogs'], blog)
);

const mostLikes = (blogs) => {
	return blogs.length === 0 ? 'Blog list is empty' :_.chain(blogs)
		.groupBy('author')
		.map((group, author) => {
		  return {
				author: author,
				likes: _.reduce(group, function(accumulator, {likes}) {
				  return accumulator + likes;
				}, 0)
		  };
		})
		.maxBy((object) => object.likes)
		.value();
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog ,
	mostBlogs,
	mostLikes

};

