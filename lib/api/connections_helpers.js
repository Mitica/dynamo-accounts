'use strict';

var utils = require('../utils');
var get = utils.get;
var models = require('../models');
var AccountConnection = models.AccountConnection;
var INDEXES = ['AccountId', 'Email'];

function getById(appId, id, options) {
	return AccountConnection
		.query(id, options)
		.execAsync()
		.then(get);
}

function findByIndex(appId, index, value) {
	index = index.toLowerCase();
	var key;
	if (index === 'accountid') {
		key = value;
	} else {
		key = AccountConnection.formatEmailKey(appId, value);
	}

	return AccountConnection
		.query(key)
		.usingIndex('DA_AccountConnections_' + index + '-gi')
		.execAsync()
		.then(get);
}

function buildConnection(appId, account, profile, accessData) {
	if (!profile.emails || profile.emails.length === 0) {
		throw new Error('Profile must contain a valid email address');
	}
	var connection = {
		id: AccountConnection.formatIdKey(appId, profile.provider, profile.id),
		appId: appId,
		providerName: profile.provider,
		providerProfileId: profile.id,
		accountId: account.id,
		accessData: accessData,
		email: profile.emails[0].value,
		username: profile.username,
		displayName: profile.displayName,
		gender: profile.gender
	};
	if (profile.name) {
		connection.familyName = profile.name.familyName;
		connection.givenName = profile.name.givenName;
		connection.middleName = profile.name.middleName;
	}

	if (profile.photos && profile.photos.length > 0) {
		connection.photo = profile.photos[0].value;
	}

	return connection;
}

function createConnection(connectionInfo) {
	connectionInfo.key__email = AccountConnection.formatEmailKey(connectionInfo.appId, connectionInfo.email);

	return AccountConnection.createAsync(connectionInfo).then(get);
}

/**
 * Exports
 */

INDEXES.forEach(function(index) {
	exports['findBy' + index] = function(appId, value) {
		return findByIndex(appId, index, value);
	};
});

exports.getById = getById;
exports.buildConnection = buildConnection;
exports.createConnection = createConnection;
