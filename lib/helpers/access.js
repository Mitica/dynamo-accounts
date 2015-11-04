'use strict';

/**
 * Access helpers
 * @module helpers/access
 */

var utils = require('../utils');
var get = utils.get;
var getFirst = utils.getFirst;
var models = require('../db/models');

function testModelName(name) {
	if (models.NAMES.indexOf(name) < 0) {
		throw new Error('Model name is invalid: ' + name);
	}
}

/**
 * Get a data item by key.
 * @param {string} model - A model name.
 * @param {(string|number)} key - Item key
 * @param {object} [options] - Options
 * @param {object} [options.params] - DynamoDB params
 * @returns {object} Founded record.
 * @protected
 */
exports.getItemByKey = function(model, key, options) {
	testModelName(model);
	return models[model].getAsync(key, options && options.params).then(get);
};

/**
 * Get a data item by key and range key.
 * @param {string} model - A model name.
 * @param {(string|number)} key - Item key
 * @param {(string|number)} rangeKey - Item range key
 * @param {object} [options] - Options
 * @param {object} [options.params] - DynamoDB params
 * @returns {object} Founded record.
 * @protected
 */
exports.getItemByRangeKey = function(model, key, rangeKey, options) {
	testModelName(model);
	return models[model].getAsync(key, rangeKey, options && options.params).then(get);
};

/**
 * Get data items by keys.
 * @param {string} model - A model name.
 * @param {(number[]|string[]|object[])} keys - Items keys
 * @param {object} [options] - Options
 * @param {object} [options.params] - DynamoDB params
 * @returns {object[]} Founded records.
 * @protected
 */
exports.getItems = function(model, keys, options) {
	testModelName(model);
	return models[model].getItemsAsync(keys, options && options.params).then(get);
};

/**
 * Query for items thet uses hash and range keys.
 * @param {string} model - A model name.
 * @param {object} data - Data for building query.
 * @param {(number|string)} data.key - Items hash key.
 * @param {number} [data.index] - Global or Local Secondary index.
 * @param {string} [data.select] - Select mode: COUNT | ALL_PROJECTED_ATTRIBUTES.
 * @param {string[]} [data.attributes] - Attributes to get.
 * @param {boolean} [data.consistentRead] - ConsistentRead param.
 * @param {number} [data.limit] - Limit items count.
 * @param {string} [data.result] - Result form: `count`, `first`.
 * @param {object} [data.where] - Filter by range key object.
 * @param {string} [data.where.rangeKey] - Range key name.
 * @param {string} [data.where.operation] - where operation name: gte, gt, lt, lte, equals, beginsWith, between.
 * @param {string} [data.where.value] - where operation value.
 * @returns {object[]} Founded records.
 * @protected
 */
exports.query = function(model, data) {
	testModelName(model);
	var query = models[model].query(data.key);

	if (data.index) {
		query.usingIndex(data.index);
	}
	if (data.limit) {
		query.limit(data.limit);
	}
	if (data.attributes) {
		query.attributes(data.attributes);
	}
	if (data.consistentRead === true) {
		query.consistentRead(true);
	}
	if (data.where && data.where.rangeKey && data.where.operation && data.where.value !== undefined) {
		query.where(data.where.rangeKey)[data.where.operation].call(query, data.where.value);
	}
	if (data.select) {
		query.select(data.select);
	}
	var result = get;
	if (data.result) {
		if (data.result === 'first') {
			result = getFirst;
		}
	}

	return query.execAsync().then(result);
};
