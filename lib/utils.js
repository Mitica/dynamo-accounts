'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var ObjectId = require('bson-objectid');
var crypto = require('crypto');
var uuid = require('node-uuid');

function getItem(data) {
	if (data) {
		return _.omit(data, 'key__id', 'key__email', 'key__key', 'key__username');
	}
	return data;
}

function get(data) {
	if (_.isNull(data) || _.isUndefined(data)) {
		return data;
	}
	if (_.isArray(data)) {
		return data.map(get);
	}
	if (Array.isArray(data.Items)) {
		return get(data.Items);
	}
	if (_.isFunction(data.toJSON)) {
		data = data.toJSON();
		if (data.Items) {
			return data.Items.map(getItem);
		}
		return getItem(data);
	}
	// if (_.isObject(data)) {
	// 	Object.keys(data).forEach(function(key) {
	// 		data[key] = internal.get(data[key]);
	// 	});
	// }
	return data;
}

function getFirst(data) {
	data = get(data);
	if (Array.isArray(data)) {
		if (data.length > 0) {
			return data[0];
		}
		return null;
	}
	return data;
}

function sha1(value) {
	return crypto.createHash('sha1').update(value).digest('hex').toLowerCase();
}

exports._ = _;
exports.Promise = Promise;
exports.newObjectId = ObjectId.generate;
exports.get = get;
exports.getFirst = getFirst;
exports.sha1 = sha1;
exports.uuid = uuid.v1;
