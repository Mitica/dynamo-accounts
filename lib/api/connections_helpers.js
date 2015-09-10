/*eslint camelcase:1*/
'use strict';

var utils = require('../utils');
var get = utils.get;
var _ = utils._;
var Promise = utils.Promise;
var models = require('../models');
var AccountConnection = models.AccountConnection;
var INDEXES = ['AccountId', 'Email'];
var cache = require('memory-cache');

function getOne(key, options) {
	key = _.pick(key, 'id', 'accountId');
	return AccountConnection.getAsync(key, options).then(get);
}

function getItems(keys, options) {
	keys = keys.map(function(key) {
		return _.pick(key, 'id', 'accountId');
	});
	return AccountConnection.getItemsAsync(keys, options).then(get);
}

function findById(id, options) {
	options = options || {};
	return AccountConnection
		.query(id)
		.limit(options.Limit || 5)
		.attributes(options.AttributesToGet || ['id', 'accountId', 'providerName', 'providerProfileId'])
		.consistentRead(!!options.ConsistentRead)
		.execAsync()
		.then(get);
}

function findByIndex(appId, index, value, options) {
	options = options || {};
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
		.limit(options.Limit || 5)
		// .consistentRead(!!options.ConsistentRead)
		.execAsync()
		.then(get);
}

function buildConnection(appId, accountId, profile, accessData) {
	if (!profile.emails || profile.emails.length === 0) {
		throw new Error('Profile must contain a valid email address');
	}
	var connection = {
		id: AccountConnection.formatId(appId, profile.provider, profile.id),
		appId: appId,
		providerName: profile.provider,
		providerProfileId: profile.id,
		accountId: accountId,
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
	connectionInfo.ukey__email = AccountConnection.formatEmailUniqueKey(connectionInfo.appId, connectionInfo.providerName, connectionInfo.email);
	connectionInfo.ukey__id = AccountConnection.formatIdUniqueKey(connectionInfo.id, connectionInfo.accountId);

	var emailKey = 'connections-email-' + connectionInfo.ukey__email;
	var idKey = 'connections-id-' + connectionInfo.ukey__id;
	if (cache.get(emailKey) || cache.get(idKey)) {
		return Promise.reject(new Error('AccountConnection object is in creating state'));
	}
	cache.put(emailKey, true, 1000 * 5);
	cache.put(idKey, true, 1000 * 5);

	var params = {};
	params.ConditionExpression = 'ukey__id <> :idKey AND ukey__email <> :emailKey';

	// params.ExpressionAttributeNames = {
	// 	'#id': 'id',
	// 	'#accountId': 'accountId'
	// };

	params.ExpressionAttributeValues = {
		':idKey': connectionInfo.ukey__id,
		':emailKey': connectionInfo.ukey__email
	};
	return AccountConnection.createAsync(connectionInfo, params).then(get);
}

/**
 * Exports
 */

INDEXES.forEach(function(index) {
	exports['findBy' + index] = function(appId, value, options) {
		return findByIndex(appId, index, value, options);
	};
});

exports.get = getOne;
exports.getItems = getItems;
exports.findById = findById;
exports.buildConnection = buildConnection;
exports.createConnection = createConnection;
