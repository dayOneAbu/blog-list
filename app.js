/* eslint-disable no-undef */
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blog');
const morgan = require('morgan');
const { errorHandler, unknownEndpoint, requestLogger } = require('./utils/middleware');
const { MONGODB_URI } = require('./utils/config');


// eslint-disable-next-line no-unused-vars
morgan.token('payload', function (req, res) {
	return JSON.stringify(req.body);
});
mongoose.connect(MONGODB_URI);
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :payload'
	)
);
app.use('/api/blogs/', blogRouter);

app.use(unknownEndpoint);
app.use(errorHandler);


module.exports = app;
