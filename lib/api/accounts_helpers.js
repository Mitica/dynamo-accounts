'use strict';

var utils = require('../utils');
var get = utils.get;
var getFirst = utils.getFirst;
var models = require('../models');
var Account = models.Account;
var INDEXES = ['Key', 'Email', 'Username'];

function getById(appId, value, options) {
	var key = Account.formatKey(appId, value);

	return Account.getAsync(key, options).then(get);
}

function findByIndex(appId, index, value) {
	var key = Account.formatKey(appId, value);

	return Account.query(key)
		.usingIndex('DA_Accounts_' + index.toLowerCase() + '-gi')
		.execAsync().then(getFirst);
}

function getBy(appId, index, value, options) {
	return findByIndex(appId, index, value).then(function(item) {
		if (!item || !item.id) {
			return item;
		}
		return getById(appId, item.id, options);
	});
}

function generateUsername(username, displayName) {
	function randomUsername() {
		return 'user-' + utils.uuid().substr(0, 8);
	}

	username = username || displayName || randomUsername();

	if (/^\d+$/.test(username)) {
		username = displayName || randomUsername();
	}

	username = username || randomUsername();
	username = username.toLowerCase()
		.replace(/[^\w\d_-]/g, ' ').trim()
		.replace(/ {2,}/g, '-')
		.replace(/-{2,}/g, '-');

	if (username.length < 3) {
		username = randomUsername();
	}

	return username;
}

function createUsername(appId, username, displayName) {

	username = generateUsername(username, displayName);

	return exports.findByUsername(appId, username)
		.then(function(account) {
			if (account) {
				return createUsername(appId);
			}
			return username;
		});
}

function buildAccount(appId, profile) {
	if (!profile.emails || profile.emails.length === 0) {
		throw new Error('Profile must contain a valid email address');
	}
	var account = {
		id: utils.newObjectId(),
		appId: appId,
		key: utils.uuid(),
		username: (profile.username || profile.displayName).toLowerCase(),
		email: profile.emails[0].value,
		displayName: profile.displayName,
		gender: profile.gender,
		customData: profile.customData
	};

	if (profile.name) {
		account.familyName = profile.name.familyName;
		account.givenName = profile.name.givenName;
		account.middleName = profile.name.middleName;
	}

	if (profile.photos && profile.photos.length > 0) {
		account.photo = profile.photos[0].value;
	}

	return createUsername(appId, account.username, account.displayName)
		.then(function(username) {
			account.username = username;
			return account;
		});
}

function createAccount(accountInfo) {
	accountInfo.key__id = Account.formatKey(accountInfo.appId, accountInfo.id);
	accountInfo.key__key = Account.formatKey(accountInfo.appId, accountInfo.key);
	accountInfo.key__email = Account.formatKey(accountInfo.appId, accountInfo.email);
	accountInfo.key__username = Account.formatKey(accountInfo.appId, accountInfo.username);

	return Account.createAsync(accountInfo).then(get);
}

/**
 * Exports
 */

INDEXES.forEach(function(index) {
	exports['findBy' + index] = function(appId, value) {
		return findByIndex(appId, index, value);
	};
	exports['getBy' + index] = function(appId, value, options) {
		return getBy(appId, index, value, options);
	};
});

exports.getById = getById;
exports.buildAccount = buildAccount;
exports.createAccount = createAccount;
