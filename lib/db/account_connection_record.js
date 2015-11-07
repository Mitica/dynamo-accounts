'use strict';

/**
	@typedef AccountConnectionRecord
	@type {object}
	@property {string} id - unique account connection id.
	@property {string} accountId - account id.
	@property {string} providerName - provider name.
	@property {string} providerProfileId - provider profile id.
	@property {string} email - unique user's email.
	@property {string} username - unique user's username.
	@property {string} displayName - user's display name.
	@property {string} familyName - user's family name.
	@property {string} givenName - user's given name.
	@property {string} middleName - user's middle name.
	@property {string} gender - user's gender: `male` or `female`.
	@property {string} photo - user's photo url.
	@property {string} accessData - access data string: (access_token, etc.).
	@property {Date} createdAt - created datetime.
	@property {Date} updatedAt - updated datetime.
*/

var utils = require('../utils');
var _ = utils._;
var assert = require('assert');

function formatKey(list) {
	return utils.sha1(list.join('|'));
}

function formatId(data) {
	assert.ok(data);
	assert.ok(data.appId);
	assert.ok(data.providerName);
	assert.ok(data.providerProfileId);

	return formatKey([data.appId.toLowerCase(), data.providerName.toLowerCase(), data.providerProfileId.toString()]);
}

function formatIdUniqueKey(data) {
	assert.ok(data);
	assert.ok(data.id);
	assert.ok(data.accountId);

	return formatKey([data.id.toLowerCase(), data.accountId.toLowerCase()]);
}

function normalizeCreate(data) {
	data = _.clone(data);

	data.id = formatId(data);
	data.ukey__id = formatIdUniqueKey(data);

	return data;
}

function normalizeUpdate(data) {
	data = _.clone(data);

	return data;
}

/**
 * @function
 */
exports.formatId = formatId;

exports.config = {
	createNormalize: normalizeCreate,
	updateNormalize: normalizeUpdate
};
