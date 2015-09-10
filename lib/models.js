/*eslint camelcase:1*/
'use strict';

var utils = require('./utils');
var Promise = utils.Promise;
var Query = require('../node_modules/vogels/lib/query.js');
var vogels = require('vogels');
var Joi = require('joi');

Query.prototype.execAsync = Query.prototype.execAsync || Promise.promisify(Query.prototype.exec);

/**
 * Constants
 */

// var MODEL_NAMES =
exports.MODEL_NAMES = ['Account', 'AccountConnection'];

/**
 * Tables creation
 */

// var App = exports.App = vogels.define('App', {
// 	tableName: 'DA_Apps',
// 	hashKey: 'key__id',
// 	// rangeKey: 'key__createdAt',
// 	timestamps: true,
// 	createdAt: 'createdAt',
// 	updatedAt: 'updatedAt',
// 	schema: {
// 		// const ObjectID
// 		id: Joi.string().trim().length(24).lowercase().required(),
// 		name: Joi.string().trim().max(100).min(5).required()
// 	},
// 	indexes: []
// });

var Account = exports.Account = vogels.define('Account', {
	tableName: 'DA_Accounts',
	hashKey: 'ukey__id',
	// rangeKey: 'key__createdAt',
	timestamps: true,
	createdAt: 'createdAt',
	updatedAt: 'updatedAt',
	schema: {
		// const ObjectID
		id: Joi.string().trim().length(24).lowercase().alphanum().required(),
		appId: Joi.string().trim().length(24).lowercase().alphanum().required(),
		// UUID
		key: Joi.string().trim().length(36).lowercase().required(),

		email: Joi.string().trim().min(5).max(100).lowercase().email().required(),
		username: Joi.string().trim().min(3).max(50).lowercase().required(),

		displayName: Joi.string().trim().min(3).max(100),
		familyName: Joi.string().trim().max(50),
		givenName: Joi.string().trim().max(50),
		middleName: Joi.string().trim().max(50),

		gender: Joi.valid('male', 'female'),
		status: Joi.valid('active', 'blocked').default('active').required(),
		role: Joi.string().trim().default('user').required(),

		photo: Joi.string().trim().max(255),

		customData: Joi.string().trim().max(800),

		// keys:
		// SHA1(appId:id)
		ukey__id: Joi.string().trim().length(40).lowercase().required(),
		// SHA1(appId:key)
		ukey__key: Joi.string().trim().length(40).lowercase().required(),
		// SHA1(appId:email)
		ukey__email: Joi.string().trim().length(40).lowercase().required(),
		// SHA1(appId:username)
		ukey__username: Joi.string().trim().length(40).lowercase().required()
	},
	indexes: [{
		hashKey: 'ukey__key',
		rangeKey: 'id',
		type: 'global',
		name: 'DA_Accounts_key-gi',
		projection: {
			// NonKeyAttributes: ['id', 'key', 'appId', 'email', 'username', 'status', 'role'],
			ProjectionType: 'KEYS_ONLY'
		}
	}, {
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

// Account.before('create', function (data, next) {
//   console.log('creating data', data);

//   return next(null, data);
// });

var AccountConnection = exports.AccountConnection = vogels.define('AccountConnection', {
	tableName: 'DA_AccountConnections',
	hashKey: 'id',
	rangeKey: 'accountId',
	timestamps: true,
	createdAt: 'createdAt',
	updatedAt: 'updatedAt',
	schema: {
		// const SHA1(appId:providerName:providerProfileId)
		id: Joi.string().trim().length(40).lowercase().required(),
		appId: Joi.string().trim().length(24).lowercase().alphanum().required(),
		accountId: Joi.string().trim().length(24).lowercase().alphanum().required(),

		providerName: Joi.string().trim().max(20).lowercase().alphanum().required(),
		providerProfileId: Joi.string().trim().max(255).required(),

		email: Joi.string().trim().min(5).max(100).lowercase().email().required(),
		username: Joi.string().trim().min(3).max(50),

		displayName: Joi.string().trim().min(3).max(100),
		familyName: Joi.string().trim().max(50),
		givenName: Joi.string().trim().max(50),
		middleName: Joi.string().trim().max(50),

		gender: Joi.valid('male', 'female'),

		photo: Joi.string().trim().max(255),

		profileUrl: Joi.string().trim().max(255),

		// accessToken:refreshToken, or token:tokenSecret, or identifier, or... IN JSON format
		accessData: Joi.string().trim().max(800).required(),

		// SHA1(appId:email)
		key__email: Joi.string().trim().length(40).lowercase().required(),
		// SHA1(appId:provider:email)
		ukey__email: Joi.string().trim().length(40).lowercase().required(),
		// SHA1(id:accountId)
		ukey__id: Joi.string().trim().length(40).lowercase().required()
	},
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

/**
 * Methods
 */

function formatKey(list) {
	return utils.sha1(list.join(':'));
}

Account.formatKey = function formatAccountKey(appId, value) {
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
