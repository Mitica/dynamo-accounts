'use strict';

var utils = require('../utils');
var Promise = utils.Promise;
var get = utils.get;
var models = require('../db/models');
var Model = require('../model');

var Models = {
	Account: require('../account_model'),
	AccountConnection: require('../account_connection_model')
};

function testModelName(name) {
	if (models.NAMES.indexOf(name) < 0) {
		throw new Error('Model name is invalid: ' + name);
	}
}

/**
 * Creates a new model record.
 * @param {string} model - Model name.
 * @param {string} appId - App id.
 * @param {object} data - Model data.
 * @param {string[]} keys - Unique records names.
 * @returns {object} Created record.
 */
function createModel(model, appId, data, keys) {
	try {
		testModelName(model);
	} catch (e) {
		return Promise.reject(e);
	}

	if (data instanceof Model && !data.getData().appId) {
		data.getData().appId = appId;
	} else {
		data.appId = data.appId || appId;
	}

	try {
		data = Models[model].create(data).normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

	var params = {};
	if (keys) {
		params.ConditionExpression = '';
		params.ExpressionAttributeNames = {};
		params.ExpressionAttributeValues = {};

		keys.forEach(function(key) {
			params.ConditionExpression += '#' + key + ' <> :' + key + ' AND ';
			params.ExpressionAttributeNames['#' + key] = key;
			params.ExpressionAttributeValues[':' + key] = data[key];
		});

		params.ConditionExpression = params.ConditionExpression.substr(0, params.ConditionExpression.length - 4);
	}

	return models[model].createAsync(data, params).then(get);
}

/**
 * @function
 */
exports.createModel = createModel;
