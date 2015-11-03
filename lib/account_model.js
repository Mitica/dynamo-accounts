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

var utils = require('./utils');
var _ = utils._;
var Model = require('./model');
var util = require('util');
var UserProfile = require('./user_profile');

function formatKey(list) {
	return utils.sha1(list.join('|'));
}

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

function normalizeCreate(data) {
	data = _.clone(data);

	data.id = data.id || utils.newObjectId();
	data.key = data.key || utils.uuid();
	data.username = data.username || data.displayName;

	if (!data.username) {
		if (data.email) {
			data.username = data.email.substr(0, data.email.indexOf('@'));
		} else {
			data.username = generateUsername();
		}
	}

	data.username = data.username.trim().replace(/\s/g, '-').replace(/-{2,}/g, '-');

	if (data.username.length < 3) {
		data.username = generateUsername();
	}

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
 * AccountModel model.
 * @param {(AccountModel|AccountRecord)} data - Data of the AccountModel model.
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @class
 * @augments Model
 */
function AccountModel(data, scope) {
	return Model.call(this, {
		name: 'Account',
		normalizeCreate: normalizeCreate,
		normalizeUpdate: normalizeUpdate,
		validateCreate: validateCreate
	}, data, scope);
}

util.inherits(AccountModel, Model);

/**
 * Creates an AccountModel object.
 * @param {(AccountRecord|AccountModel)} data - Data to use for creating a new AccountModel
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @returns {AccountModel} Returns the AccountModel passed as param `data` or a new created AccountModel.
 */
AccountModel.create = function(data, scope) {
	return Model.create(AccountModel, data, scope);
};

/**
 * Creates an AccountModel object from a UserProfile object.
 * @param {UserProfile} profile - Data to use for creating a new AccountModel
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @returns {AccountModel} Returns the AccountModel passed as param `data` or a new created AccountModel.
 */
AccountModel.createFromUserProfile = function(profile, scope) {
	return AccountModel.create(UserProfile.convertToAccount(profile), scope);
};

/**
 * Formats an account key or id.
 * @param {string} appId - Application id
 * @param {string} value - Can be account `key` or `id`, the formula is the same.
 * @function
 * @returns {string}
 */
AccountModel.formatUniqueKey = formatAccountKey;

module.exports = AccountModel;
