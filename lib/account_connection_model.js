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

var utils = require('./utils');
var _ = utils._;
var Model = require('./model');
var util = require('util');
var UserProfile = require('./user_profile');
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

function formatEmailKey(data) {
	assert.ok(data);
	assert.ok(data.appId);
	assert.ok(data.email);

	return formatKey([data.appId.toLowerCase(), data.email.toLowerCase()]);
}

function formatEmailUniqueKey(data) {
	assert.ok(data);
	assert.ok(data.appId);
	assert.ok(data.providerName);
	assert.ok(data.email);

	return formatKey([data.appId.toLowerCase(), data.providerName.toLowerCase(), data.email.toLowerCase()]);
}

function normalizeCreate(data) {
	data = _.clone(data);

	data.id = formatId(data);
	data.ukey__id = formatIdUniqueKey(data);
	data.key__email = formatEmailKey(data);
	data.ukey__email = formatEmailUniqueKey(data);

	return data;
}

function normalizeUpdate(data) {
	data = _.clone(data);

	return data;
}

/**
 * AccountConnectionModel model.
 * @param {(AccountConnectionModel|AccountConnectionRecord)} data - Data of the AccountConnectionModel model.
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @class
 * @augments Model
 */
function AccountConnectionModel(data, scope) {
	return Model.call(this, {
		name: 'AccountConnection',
		normalizeCreate: normalizeCreate,
		normalizeUpdate: normalizeUpdate
	}, data, scope);
}

util.inherits(AccountConnectionModel, Model);

/**
 * Creates an AccountConnectionModel object.
 * @param {(AccountConnectionRecord|AccountConnectionModel)} data - Data to use for creating a new AccountConnectionModel
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @returns {AccountConnectionModel} Returns the AccountConnectionModel passed as param `data` or a new created AccountConnectionModel.
 */
AccountConnectionModel.create = function(data, scope) {
	return Model.create(AccountConnectionModel, data, scope);
};

/**
 * Creates an AccountConnectionModel object from a UserProfile object.
 * @param {UserProfile} profile - Data to use for creating a new AccountConnectionModel
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @returns {AccountConnectionModel} Returns the AccountConnectionModel passed as param `data` or a new created AccountConnectionModel.
 */
AccountConnectionModel.createFromUserProfile = function(profile, scope) {
	return AccountConnectionModel.create(UserProfile.convertToAccountConnection(profile), scope);
};

AccountConnectionModel.formatEmailKey = function(appId, email) {
	return formatEmailKey({
		appId: appId,
		email: email
	});
};

module.exports = AccountConnectionModel;
