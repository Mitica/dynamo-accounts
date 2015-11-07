'use strict';

var utils = require('./utils');
var _ = utils._;
var Promise = utils.Promise;
var models = require('./db/models');
var AccountRecord = require('./db/account_record');
var accessHelpers = require('vogels-helpers').access;

/**
 * Creates a new AccessService object.
 * @param {string} appId - Application id
 * @class
 */
function AccessService(appId) {
	/**
	 * Gets application id
	 * @protected
	 * @returns {string}
	 */
	this.getAppId = function() {
		return appId;
	};

	Object.defineProperty(this, 'appId', {
		get: function() {
			return appId;
		}
	});
}

module.exports = AccessService;

/**
 * Creates a new username.
 * @param {string[]} [validNames] - An array of valid usernames.
 * @returns {string}
 */
AccessService.prototype.newAccountUsername = function(validNames) {
	validNames = validNames || [];
	var self = this;

	if (!Array.isArray(validNames)) {
		return Promise.reject(new Error('validNames must be an array'));
	}
	validNames.push(AccountRecord.generateUsername());
	validNames.push(AccountRecord.generateUsername());

	validNames = validNames.filter(function(name) {
		return name && name.trim().length > 2;
	});

	var username;
	return Promise.resolve(validNames)
		.each(function(name) {
			if (username) {
				return null;
			}
			name = AccountRecord.normalizeUsername(name);
			// var key = AccountRecord.formatAccountKey(appId, name);
			return self.getAccountIdByUsername(name)
				.then(function(id) {
					if (!id && !username) {
						username = name;
					}
				});
		})
		.then(function() {
			return username || AccountRecord.generateUsername();
		});
};

/**
 * Get an Account record.
 * @param {string} id - Account id
 * @param {object} [options] - Options object
 * @param {object} [options.params] - AWS params
 * @returns {AccountRecord}
 */
AccessService.prototype.getAccount = function(id, options) {
	var appId = this.getAppId();
	id = AccountRecord.formatUniqueKey(appId, id);

	options = options || {};
	options.format = options.format || 'json';

	return accessHelpers.getItemByKey(models.ACCOUNT_NAME, id, options);
};

/**
 * Get Account records.
 * @param {string[]} ids - Account ids
 * @param {object} [options] - Options object
 * @param {object} [options.params] - AWS params
 * @returns {AccountRecord[]}
 */
AccessService.prototype.getAccounts = function(ids, options) {
	var appId = this.getAppId();
	ids = ids.map(function(id) {
		return AccountRecord.formatUniqueKey(appId, id);
	});

	options = options || {};
	options.format = options.format || 'json';

	return accessHelpers.getItems(models.ACCOUNT_NAME, ids, options);
};

/**
 * Get an Account record by username.
 * @param {string} username - Account username
 * @param {object} [options] - Options object
 * @param {object} [options.params] - AWS params
 * @returns {AccountRecord}
 */
AccessService.prototype.getAccountByUsername = function(username, options) {
	var self = this;
	return self.getAccountIdByUsername(username)
		.then(function(id) {
			if (id) {
				options = options || {};
				options.format = options.format || 'json';
				return self.getAccount(id, options);
			}
		});
};

/**
 * Get an Account id by username.
 * @param {string} username - Account username
 * @param {object} [options] - Options object
 * @param {object} [options.params] - AWS params
 * @returns {string}
 */
AccessService.prototype.getAccountIdByUsername = function(username) {
	var appId = this.getAppId();
	var key = AccountRecord.formatUniqueKey(appId, username);

	return accessHelpers.query(models.ACCOUNT_NAME, {
			key: key,
			index: 'DA_Accounts_username-gi',
			format: 'first'
		})
		.then(function(row) {
			if (row) {
				return row.id;
			}
		});
};

/**
 * Get an AccountConnection record.
 * @param {string} id - AccountConnection id
 * @param {string} accountId - Account id
 * @param {object} [options] - Options object
 * @param {object} [options.params] - AWS params
 * @returns {AccountRecord}
 */
AccessService.prototype.getConnection = function(id, accountId, options) {
	options = options || {};
	options.format = options.format || 'json';
	return accessHelpers.getItemByRangeKey(models.ACCOUNT_CONNECTION_NAME, id, accountId, options);
};

/**
 * Get AccountConnection records.
 * @param {object[]} keys - AccountConnection keys
 * @param {string} keys.id - AccountConnection id
 * @param {string} keys.accountId - Account id
 * @param {object} [options] - Options object
 * @param {object} [options.params] - AWS params
 * @example
 * accessService
 * .getAccountConnections([{id: 'id1', accountId: 'aid1'}, {id: 'id1', accountId: 'aid2'}])
 * 	.then(function(list){});
 * @returns {AccountRecord}
 */
AccessService.prototype.getConnections = function(keys, options) {
	options = options || {};
	options.format = options.format || 'json';
	return accessHelpers.getItems(models.ACCOUNT_CONNECTION_NAME, keys, options);
};

/**
 * Get Account Connections by id.
 * @param {object} data - Data for building query.
 * @param {string} data.id - AccountConnection id.
 * @param {number} [data.limit] - Limit items count.
 * @param {string[]} [data.attributes] - Attributes to get.
 * @param {boolean} [data.consistentRead] - ConsistentRead param.
 * @param {object} [data.where] - Filter by range key object.
 * @param {string} [data.where.rangeKey] - Range key name.
 * @param {string} [data.where.operation] - where operation name: gte, gt, lt, lte, equals, beginsWith, between.
 * @param {string} [data.where.value] - where operation value.
 * @returns {AccountConnectionRecord[]}
 */
AccessService.prototype.getConnectionsById = function(data) {
	var id = data.id;
	data = _.pick(data, ['limit', 'where', 'attributes', 'consistentRead']);
	data.key = id;
	data.format = data.format || 'items';

	return accessHelpers.query(models.ACCOUNT_CONNECTION_NAME, data);
};

/**
 * Find Account Connections by account id.
 * @param {object} data - Data for building query.
 * @param {string} data.accountId - Account id.
 * @param {number} [data.limit] - Limit items count.
 * @param {string[]} [data.attributes] - Attributes to get.
 * @param {boolean} [data.consistentRead] - ConsistentRead param.
 * @param {object} [data.where] - Filter by range key object.
 * @param {string} [data.where.rangeKey] - Range key name.
 * @param {string} [data.where.operation] - where operation name: gte, gt, lt, lte, equals, beginsWith, between.
 * @param {string} [data.where.value] - where operation value.
 * @returns {object[]}
 */
AccessService.prototype.findConnectionsByAccountId = function(data) {
	var accountId = data.accountId;
	data = _.pick(data, ['limit', 'where', 'attributes', 'consistentRead']);
	data.key = accountId;
	data.index = 'DA_AccountConnections_accountId-gi';

	data.format = data.format || 'items';

	return accessHelpers.query(models.ACCOUNT_CONNECTION_NAME, data);
};
