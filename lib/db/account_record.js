'use strict';

/**
	@typedef AccountRecord
	@type {object}
	@property {string} id - unique account id.
	@property {string} key - unique random generated key.
	@property {string} email - unique user's email.
	@property {string} username - unique user's username.
	@property {string} displayName - user's display name.
	@property {string} familyName - user's family name.
	@property {string} givenName - user's given name.
	@property {string} middleName - user's middle name.
	@property {string} gender - user's gender: `male` or `female`.
	@property {string} status - user's status: `active`, `blocked`.
	@property {string} role - user's role: `user` or any custom value.
	@property {string} photo - user's photo url.
	@property {string} customData - some custom data.
	@property {Date} createdAt - created datetime.
	@property {Date} updatedAt - updated datetime.
*/

var utils = require('../utils');
var _ = utils._;

function formatKey(list) {
	return utils.sha1(list.join('|'));
}

/**
 * Generates a new username.
 */
function generateUsername() {
	return utils.randomString(utils.randomInt(5, 15)).toLowerCase();
}

function generatePassword() {
	return utils.randomString(utils.randomInt(8, 15));
}

/**
 * Formats an account key or id.
 * @param {string} appId - Application id
 * @param {string} value - Can be account `key` or `id`, the formula is the same.
 * @returns {string}
 * @private
 */
function formatAccountKey(appId, value) {
	return formatKey([appId.toLowerCase(), value.trim().toLowerCase()]);
}

/**
 * Normalize an username
 * @param {string} username - A known username
 * @param {string} displayName - A known display name
 * @return {string}
 */
function normalizeUsername(username, displayName) {
	username = username || displayName || generateUsername();

	username = username.trim().replace(/\s/g, '-').replace(/-{2,}/g, '-');

	if (username.length < 3) {
		username = generateUsername();
	}

	return username;
}

function normalizeCreate(data) {
	data = _.clone(data);

	data.id = data.id || utils.uuid();
	data.key = data.key || utils.uuid();
	data.username = normalizeUsername(data.username, data.displayName);

	data.ukey__id = formatAccountKey(data.appId, data.id);
	data.ukey__key = formatAccountKey(data.appId, data.key);
	data.ukey__username = formatAccountKey(data.appId, data.username);
	if (data.email) {
		data.ukey__email = formatAccountKey(data.appId, data.email);
	}

	if (!data.displayName) {
		if (data.givenName && data.familyName) {
			data.displayName = [data.givenName.trim(), data.familyName.trim()].join(' ');
		}
	}

	data.password = data.password || generatePassword();
	data.password = utils.sha1(data.password);

	// data.status = data.status || 'active';
	// data.role = data.role || 'user';

	return data;
}

function normalizeUpdate(data) {
	data = _.clone(data);

	delete data.ukey__id;
	delete data.ukey__key;
	delete data.ukey__email;
	delete data.ukey__username;

	if (data.id) {
		data.ukey__id = formatAccountKey(data.appId, data.id);
	}
	if (data.key) {
		data.ukey__key = formatAccountKey(data.appId, data.key);
	}
	if (data.username) {
		data.ukey__username = formatAccountKey(data.appId, data.username);
	}
	if (data.email) {
		data.ukey__email = formatAccountKey(data.appId, data.email);
	}

	if (data.password) {
		data.password = utils.sha1(data.password);
	}

	return data;
}

function validateCreate(data) {
	if (!data.email) {
		throw new Error('`email` field is required');
	}
}

/**
 * @function
 */
exports.generateUsername = generateUsername;

/**
 * @function
 */
exports.normalizeUsername = normalizeUsername;

/**
 * Formats an account key or id.
 * @param {string} appId - Application id
 * @param {string} value - Can be account `key` or `id`, the formula is the same.
 * @function
 * @returns {string}
 */
exports.formatUniqueKey = formatAccountKey;

exports.config = {
	createNormalize: normalizeCreate,
	updateNormalize: normalizeUpdate,
	createValidate: validateCreate
};
