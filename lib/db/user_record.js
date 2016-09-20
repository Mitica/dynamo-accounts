'use strict';

var utils = require('../utils');
var _ = utils._;

function formatKey(list) {
	return utils.sha1(list.join('|'));
}

function formatId(appId, id) {
	return formatKey([appId.trim(), id.trim()]);
}

function normalizeCreate(item) {

	item.id = formatId(item.appId, item.data.id);
	item.createdAt = new Date(item.data.createdAt || Date.now()).getTime();
	item.updatedAt = new Date(item.data.updatedAt || Date.now()).getTime();
	if (item.data.lastLoginAt) {
		item.lastLoginAt = new Date(item.data.lastLoginAt).getTime();
	}

	return item;
}

function normalizeUpdate(item) {

	item.id = formatId(item.appId, item.data.id);
	item.updatedAt = new Date(item.data.updatedAt || Date.now()).getTime();
	if (item.data.lastLoginAt) {
		item.lastLoginAt = new Date(item.data.lastLoginAt).getTime();
	}

	delete item.data;

	return item;
}

function validateCreate(item) {
	if (!_.isString(item.appId) || item.appId.length < 16) {
		throw new Error('`appId` field is invalid');
	}
	if (!_.isPlainObject(item.data)) {
		throw new Error('`data` field is invalid');
	}
	if (!_.isString(item.data.id)) {
		throw new Error('`data.id` field is invalid');
	}
}

function validateUpdate(item) {
	// if (!_.isPlainObject(item.data)) {
	// 	throw new Error('`data` field is invalid');
	// }
	// if (!_.isString(item.data.id)) {
	// 	throw new Error('`data.id` field is invalid');
	// }
}

exports.formatId = formatId;

exports.config = {
	createNormalize: normalizeCreate,
	updateNormalize: normalizeUpdate,
	createValidate: validateCreate,
	updateValidate: validateUpdate
};
