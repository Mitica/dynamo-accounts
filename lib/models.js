/*eslint camelcase:1*/
'use strict';

var utils = require('./utils');
var Promise = utils.Promise;
var Query = require('../node_modules/vogels/lib/query.js');
var vogels = require('vogels');
var Joi = require('joi');
// var assert = require('assert');
// var slug = require('slug');

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
	hashKey: 'key__id',
	// rangeKey: 'key__createdAt',
	timestamps: true,
	createdAt: 'createdAt',
	updatedAt: 'updatedAt',
	schema: {
		// const ObjectID
		id: Joi.string().trim().length(24).lowercase().required(),
		appId: Joi.string().trim().length(24).lowercase().required(),
		// UUID
		key: Joi.string().trim().length(36).lowercase().required(),

		email: Joi.string().trim().min(5).max(100).lowercase().email().required(),
		username: Joi.string().trim().min(3).max(50).required(),

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
		key__id: Joi.string().trim().length(40).lowercase().required(),
		// SHA1(appId:key)
		key__key: Joi.string().trim().length(40).lowercase().required(),
		// SHA1(appId:email)
		key__email: Joi.string().trim().length(40).lowercase().required(),
		// SHA1(appId:username)
		key__username: Joi.string().trim().length(40).lowercase().required()
	},
	indexes: [{
		hashKey: 'key__key',
		rangeKey: 'id',
		type: 'global',
		name: 'DA_Accounts_key-gi',
		projection: {
			// NonKeyAttributes: ['id', 'key', 'appId', 'email', 'username', 'status', 'role'],
			ProjectionType: 'KEYS_ONLY'
		}
	}, {
		hashKey: 'key__email',
		rangeKey: 'id',
		type: 'global',
		name: 'DA_Accounts_email-gi',
		projection: {
			// NonKeyAttributes: ['id', 'key', 'appId', 'email', 'username', 'status', 'role'],
			ProjectionType: 'KEYS_ONLY'
		}
	}, {
		hashKey: 'key__username',
		rangeKey: 'id',
		type: 'global',
		name: 'DA_Accounts_username-gi',
		projection: {
			// NonKeyAttributes: ['id', 'key', 'appId', 'email', 'username', 'status', 'role'],
			ProjectionType: 'KEYS_ONLY'
		}
	}]
});

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
		appId: Joi.string().trim().length(24).lowercase().required(),
		accountId: Joi.string().trim().length(24).lowercase().required(),

		providerName: Joi.string().trim().max(20).lowercase().required(),
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
		key__email: Joi.string().trim().length(40).lowercase().required()
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

AccountConnection.formatIdKey = function formatAccountConnectionId(appId, providerName, providerProfileId) {
	return formatKey([appId.toLowerCase(), providerName.toLowerCase(), providerProfileId]);
};

AccountConnection.formatEmailKey = function formatAccountConnectionEmail(appId, email) {
	return formatKey([appId.toLowerCase(), email.toLowerCase()]);
};
