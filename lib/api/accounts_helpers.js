/*eslint camelcase:1*/
'use strict';

var utils = require('../utils');
var get = utils.get;
var Promise = utils.Promise;
var getFirst = utils.getFirst;
var models = require('../models');
var Account = models.Account;
var INDEXES = ['Key', 'Username'];
var cache = require('memory-cache');

function getOne(appId, value, options) {
	var key = Account.formatKey(appId, value);

	return Account.getAsync(key, options).then(get);
}

function getItems(appId, values, options) {
	var keys = [],
		key;
	values.forEach(function(value) {
		key = Account.formatKey(appId, value);
		keys.push(key);
	});

	return Account.getItemsAsync(keys, options).then(get);
}

function findOneByIndex(appId, index, value) {
	var key = Account.formatKey(appId, value);

	return Account
		.query(key)
		.usingIndex('DA_Accounts_' + index.toLowerCase() + '-gi')
		.limit(1)
		.execAsync()
		.then(getFirst);
}

function getBy(appId, index, value, options) {
	return findOneByIndex(appId, index, value).then(function(item) {
		if (!item || !item.id) {
			return item;
		}
		return getOne(appId, item.id, options);
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

	return exports.findOneByUsername(appId, username)
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

function createAccount(info) {
	info.ukey__id = Account.formatKey(info.appId, info.id);
	info.ukey__key = Account.formatKey(info.appId, info.key);
	info.ukey__email = Account.formatKey(info.appId, info.email);
	info.ukey__username = Account.formatKey(info.appId, info.username);

	var emailKey = 'accounts-email-' + info.ukey__email;
	var usernameKey = 'accounts-username-' + info.ukey__username;
	if (cache.get(emailKey) || cache.get(usernameKey)) {
		return Promise.reject(new Error('Account object is in creating state'));
	}
	cache.put(emailKey, true, 1000 * 5);
	cache.put(usernameKey, true, 1000 * 5);

	var params = {};
	params.ConditionExpression = 'ukey__username <> :usernameKey AND ukey__email <> :emailKey';

	params.ExpressionAttributeValues = {
		':usernameKey': info.ukey__username,
		':emailKey': info.ukey__email
	};

	return Account.createAsync(info, params).then(get);
}

/**
 * Exports
 */

INDEXES.forEach(function(index) {
	exports['findOneBy' + index] = function(appId, value) {
		return findOneByIndex(appId, index, value);
	};
	exports['getBy' + index] = function(appId, value, options) {
		return getBy(appId, index, value, options);
	};
});

exports.get = getOne;
exports.getItems = getItems;
exports.buildAccount = buildAccount;
exports.createAccount = createAccount;
