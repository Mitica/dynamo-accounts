'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var ObjectId = require('bson-objectid');
var crypto = require('crypto');
var uuid = require('node-uuid');
// var supportsOauth = [1, true, '1', 'true', 'True'].indexOf(process.env.ACCOUNTS_OAUTH_SUPPORT);

function getItem(data) {
	if (data) {
		return _.omit(data, 'key__id', 'ukey__id', 'key__email', 'ukey__email', 'key__key', 'ukey__key', 'ukey__username');
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

function randomString(length, chars) {
	chars = chars || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	var result = '';
	for (var i = length; i > 0; --i) {
		result += chars[Math.round(Math.random() * (chars.length - 1))];
	}
	return result;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 * @param {number} min - Min value
 * @param {number} max - Max value
 * @returns {number} A random integer
 * @private
 */
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
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
exports.randomInt = randomInt;
exports.randomString = randomString;
