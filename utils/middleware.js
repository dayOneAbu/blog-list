/* eslint-disable no-mixed-spaces-and-tabs */
const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');
const logger = require('./logger');
const requestLogger = (request, response, next) => {
	logger.info('Method:', request.method);
	logger.info('Path:  ', request.path);
	logger.info('Body:  ', request.body);
	logger.info('---');
	next();
};

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};
const tokenExtractor = (req) => {
	const authorization = req.get('authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return  authorization.substring(7);
	}
};
const userExtractor = (req, res, next) => {
	const token = tokenExtractor(req);
	if (!token) {
	  return res.status(401).json({
			success: false,
			message: 'No token, access denied',
	  });
	}
	  jwt.verify(token, SECRET, (error, decoded) => {
		if (error) {
		  return res.status(401).json({
				success: false,
				message: 'token not valid',
		  });
		} else {
		 req.user = decoded.id;
		 next();
		}
	  });

};


const errorHandler = (error, request, response, next) => {
	logger.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}else if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({
			error: 'invalid token'
		});
	} else if (error.name === 'TokenExpiredError') {
		return response.status(401).json({
			error: 'token expired'
		});
	}

	next(error);
};

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor,userExtractor
};
