'use strict';

var utils = require('../utils');
var Promise = utils.Promise;
var vogelsHelpers = require('vogels-helpers');
var IdentityRecord = require('./identity_record');
var UserRecord = require('./user_record');
var schemas = require('./schemas');
var UserSchema = schemas.UserSchema;
var IdentitySchema = schemas.IdentitySchema;
var tablePrefix = process.env.ACCOUNTS_TABLE_PREFIX || 'DA';

exports.NAMES = ['User', 'Identity'];

/**
 * Tables creation
 */

var User = vogels.define('DA_User', {
	tableName: [tablePrefix, 'Users'].join('_'),
	hashKey: 'id',
	timestamps: false,
	schema: UserSchema,
	indexes: [{
		hashKey: 'appId',
		rangeKey: 'createdAt',
		type: 'global',
		name: 'DA_Users_createdAt-gi',
		projection: {
			ProjectionType: 'KEYS_ONLY'
		}
	}, {
		hashKey: 'appId',
		rangeKey: 'lastLoginAt',
		type: 'global',
		name: 'DA_Users_lastLoginAt-gi',
		projection: {
			ProjectionType: 'KEYS_ONLY'
		}
	}]
});

var Identity = vogels.define('DA_Identity', {
	tableName: [tablePrefix, 'Identities'].join('_'),
	hashKey: 'id',
	timestamps: false,
	schema: IdentitySchema,
	indexes: [{
		hashKey: 'userId',
		rangeKey: 'createdAt',
		type: 'global',
		name: 'DA_Identities_userId-gi',
		projection: {
			ProjectionType: 'KEYS_ONLY'
		}
	}]
});

vogelsHelpers.define('DA_User', User, UserRecord.config);
vogelsHelpers.define('DA_Identity', Identity, IdentityRecord.config);

exports.User = User;
exports.Identity = Identity;
