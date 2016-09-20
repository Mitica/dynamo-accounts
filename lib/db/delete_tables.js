'use strict';

var utils = require('../utils');
var Promise = utils.Promise;
var models = require('./models');

module.exports = function deleteTables(code) {
	var list = [];

	if (code !== (process.env.DYNAMO_ACCOUNTS_SECURE_CODE || 'iam-sure')) {
		return Promise.reject(new Error('Wake up dude!'));
	}

	models.NAMES.forEach(function(modelName) {
		var model = models[modelName];
		list.push(model);
	});

	return Promise.map(list, function(model) {
		console.log('Deleting table ', model.tableName(), '...');
		return model.deleteTableAsync();
	});
};
