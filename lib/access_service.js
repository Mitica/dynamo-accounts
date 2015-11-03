'use strict';

var utils = require('./utils');
var _ = utils._;
var models = require('./db/models');
var AccountModel = require('./account_model');
var AccountConnectionModel = require('./account_connection_model');
var accessHelpers = require('./access_helpers');

/**
 * Creates a new AccessService object.
 * @param {string} appId - Application id
 * @class
 */
function AccessService(appId) {
	/**
	 * Gets application id
	 * @private
	 * @returns {string}
	 */
	this.getAppId = function() {
		return appId;
	};
}

module.exports = AccessService;

/**
 * Get an Account record.
 * @param {string} id - Account id
 * @param {object} [options] - Options object
 * @param {object} [options.params] - AWS params
 * @returns {AccountRecord}
 */
AccessService.prototype.getAccount = function(id, options) {
	var appId = this.getAppId();
	id = AccountModel.formatUniqueKey(appId, id);

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
		return AccountModel.formatUniqueKey(appId, id);
	});

	return accessHelpers.getItems(models.ACCOUNT_NAME, ids, options);
};

/**
 * Get an Account record by username.
 * @param {string} username - Account username
 * @param {object} [options] - Options object
 * @param {object} [options.params] - AWS params
 * @returns {AccountRecord}
 */
AccessService.prototype.getAccountByUserName = function(username, options) {
	var self = this;

	return self.getAccountIdByUserName(username)
		.then(function(id) {
			if (id) {
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
AccessService.prototype.getAccountIdByUserName = function(username) {
	var appId = this.getAppId();
	var key = AccountModel.formatUniqueKey(appId, username);

	return accessHelpers.query(models.ACCOUNT_NAME, {
			key: key,
			index: 'DA_Accounts_username-gi'
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
AccessService.prototype.getAccountConnection = function(id, accountId, options) {
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
AccessService.prototype.getAccountConnections = function(keys, options) {
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
AccessService.prototype.getAccountConnectionsById = function(data) {
	var id = data.id;
	data = _.pick(data, ['limit', 'where', 'attributes', 'consistentRead']);
	data.key = id;

	return accessHelpers.query(models.ACCOUNT_CONNECTION_NAME, data)
		.then(function(row) {
			if (row) {
				return row.id;
			}
		});
};

/**
 * Find Account Connections by email.
 * @param {object} data - Data for building query.
 * @param {string} data.email - AccountConnection email.
 * @param {number} [data.limit] - Limit items count.
 * @param {string[]} [data.attributes] - Attributes to get.
 * @param {boolean} [data.consistentRead] - ConsistentRead param.
 * @param {object} [data.where] - Filter by range key object.
 * @param {string} [data.where.rangeKey] - Range key name.
 * @param {string} [data.where.operation] - where operation name: gte, gt, lt, lte, equals, beginsWith, between.
 * @param {string} [data.where.value] - where operation value.
 * @returns {object[]}
 */
AccessService.prototype.findAccountConnectionsByEmail = function(data) {
	var appId = this.getAppId();
	var email = data.email;
	data = _.pick(data, ['limit', 'where', 'attributes', 'consistentRead']);
	data.key = AccountConnectionModel.formatEmailKey(appId, email);
	data.index = 'DA_AccountConnections_email-gi';

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
AccessService.prototype.findAccountConnectionsByAccountId = function(data) {
	var accountId = data.accountId;
	data = _.pick(data, ['limit', 'where', 'attributes', 'consistentRead']);
	data.key = accountId;
	data.index = 'DA_AccountConnections_accountId-gi';

	return accessHelpers.query(models.ACCOUNT_CONNECTION_NAME, data);
};
