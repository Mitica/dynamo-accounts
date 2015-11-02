'use strict';

var utils = require('../utils');
var Promise = utils.Promise;
var Query = require('../../node_modules/vogels/lib/query.js');
var vogels = require('vogels');
var schemas = require('./schemas');
var AccountSchema = schemas.AccountSchema;
var AccountConnectionSchema = schemas.AccountConnectionSchema;
var tablePrefix = process.env.ACCOUNTS_TABLE_PREFIX || 'DA';

Query.prototype.execAsync = Query.prototype.execAsync || Promise.promisify(Query.prototype.exec);

/**
 * Constants
 */

exports.NAMES = ['Account', 'AccountConnection'];

/**
 * Tables creation
 */

var Account = vogels.define('DA_Account', {
	tableName: [tablePrefix, 'Accounts'].join('_'),
	hashKey: 'ukey__id',
	timestamps: true,
	createdAt: 'createdAt',
	updatedAt: 'updatedAt',
	schema: AccountSchema,
	indexes: [{
		hashKey: 'ukey__username',
		rangeKey: 'id',
		type: 'global',
		name: 'DA_Accounts_username-gi',
		projection: {
			// NonKeyAttributes: ['id', 'key', 'appId', 'email', 'username', 'status', 'role'],
			ProjectionType: 'KEYS_ONLY'
		}
	}]
});

var AccountConnection = vogels.define('DA_AccountConnection', {
	tableName: [tablePrefix, 'AccountConnections'].join('_'),
	hashKey: 'id',
	rangeKey: 'accountId',
	timestamps: true,
	createdAt: 'createdAt',
	updatedAt: 'updatedAt',
	schema: AccountConnectionSchema,
	indexes: [{
		hashKey: 'accountId',
		rangeKey: 'id',
		type: 'global',
		name: 'DA_AccountConnections_accountid-gi',
		projection: {
			// NonKeyAttributes: ['id', 'providerName'],
			ProjectionType: 'KEYS_ONLY'
		}
	}, {
		hashKey: 'key__email',
		rangeKey: 'accountId',
		type: 'global',
		name: 'DA_AccountConnections_email-gi',
		projection: {
			// NonKeyAttributes: ['id', 'providerName'],
			ProjectionType: 'KEYS_ONLY'
		}
	}]
});

/**
 * Tables promisify
 */

Promise.promisifyAll(Account);
Promise.promisifyAll(AccountConnection);

exports.Account = Account;
exports.AccountConnection = AccountConnection;

/**
 * Methods
 */

function formatKey(list) {
	return utils.sha1(list.join(':'));
}

Account.formatKey = function formatAccountKey(appId, value) {
	return formatKey([appId.toLowerCase(), value.toLowerCase()]);
};

Account.formatId = function formatAccountKey(appId, value) {
	return formatKey([appId.toLowerCase(), value.toLowerCase()]);
};

AccountConnection.formatId = function formatAccountConnectionId(appId, providerName, providerProfileId) {
	return formatKey([appId.toLowerCase(), providerName.toLowerCase(), providerProfileId]);
};

AccountConnection.formatIdUniqueKey = function formatAccountConnectionId(id, accountId) {
	return formatKey([id.toLowerCase(), accountId.toLowerCase()]);
};

AccountConnection.formatEmailKey = function formatAccountConnectionEmail(appId, email) {
	return formatKey([appId.toLowerCase(), email.toLowerCase()]);
};

AccountConnection.formatEmailUniqueKey = function formatAccountConnectionEmail(appId, providerName, email) {
	return formatKey([appId.toLowerCase(), providerName.toLowerCase(), email.toLowerCase()]);
};
