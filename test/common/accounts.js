'use strict';

if (!process.env.AWS_REGION) {
	module.exports = false;
	console.log('To run all tests you must set ENV variables for AWS');
	return;
}

module.exports = require('../../lib');
