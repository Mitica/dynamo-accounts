'use strict';

var utils = require('../utils');
var Promise = utils.Promise;
var _ = utils._;
var models = require('../db/models');
var accountsHelpers = require('./accounts_helpers');
var connectionsHelpers = require('./connections_helpers');
var AccountConnection = models.AccountConnection;
var internal = {};

module.exports = function providerLoginCreator(appId) {

	function providerLogin(profile, accessData) {
		if (!accessData) {
			return Promise.reject(new Error('accessData is required'));
		}
		if (!_.isString(accessData)) {
			accessData = JSON.stringify(accessData);
		}
		return internal.login(appId, profile, accessData);
	}

	return providerLogin;
};

internal.login = function(appId, profile, accessData) {
	return internal.findAccountConnection(appId, profile, accessData)
		.then(function(connection) {
			if (connection) {
				// console.log('found connection', connection);
				return accountsHelpers.getOne(appId, connection.accountId);
			}
			// console.log('NOT found connection', connection);
			return accountsHelpers.buildAccount(appId, profile)
				.then(function(accountInfo) {
					return accountsHelpers.createAccount(accountInfo)
						.then(function(account) {
							return internal.createAccountConnection(appId, account.id, profile, accessData)
								.then(function() {
									return account;
								});
						});
				});
		});
};

internal.findAccountConnection = function findAccountConnection(appId, profile, accessData) {
	var id = AccountConnection.formatId(appId, profile.provider, profile.id);
	// console.log('finding AccountConnection', id, Date.now());
	return connectionsHelpers.findById(id, {
			ConsistentRead: true
		})
		.then(function(itemsById) {
			if (itemsById && itemsById.length > 0) {
				return itemsById[0];
			}
			if (profile.emails && profile.emails.length > 0) {
				var email = profile.emails[0].value;
				return connectionsHelpers.findByEmail(appId, email)
					.then(function(itemsByEmail) {
						if (itemsByEmail && itemsByEmail.length > 0) {
							var connection = itemsByEmail[0];
							if (connection.id === id) {
								return connection;
							}
							return internal.createAccountConnection(appId, connection.accountId, profile, accessData);
						}
					});
			}
		});
};

internal.createAccountConnection = function createAccountConnection(appId, accountId, profile, accessData) {
	var connectionInfo = connectionsHelpers.buildConnection(appId, accountId, profile, accessData);

	return connectionsHelpers.createConnection(connectionInfo);
};
