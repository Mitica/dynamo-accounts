'use strict';

var utils = require('../utils');
var Promise = utils.Promise;
var _ = utils._;
var models = require('../models');
var accountsHelpers = require('./accounts_helpers');
var connectionsHelpers = require('./connections_helpers');
var AccountConnection = models.AccountConnection;
var Account = models.Account;
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
	return internal.findAccountConnection(appId, profile)
		.then(function(connection) {
			if (connection) {
				return accountsHelpers.getById(appId, connection.accountId);
			}
			return accountsHelpers.buildAccount(appId, profile)
				.then(function(accountInfo) {
					return accountsHelpers.createAccount(accountInfo)
						.then(function(account) {
							var connectionInfo = connectionsHelpers.buildConnection(appId, account, profile, accessData);

							return connectionsHelpers.createConnection(connectionInfo)
								.then(function() {
									return account;
								});
						});
				});
		});
};

internal.findAccountConnection = function findAccountConnection(appId, profile) {
	var id = AccountConnection.formatIdKey(appId, profile.provider, profile.id);
	return connectionsHelpers.getById(appId, id)
		.then(function(itemsById) {
			if (itemsById && itemsById.length > 0) {
				return itemsById[0];
			}
			if (profile.emails && profile.emails.length > 0) {
				var email = profile.emails[0].value;
				return connectionsHelpers.findByEmail(appId, email)
					.then(function(itemsByEmail) {
						if (itemsByEmail && itemsByEmail.length > 0) {
							return itemsByEmail[0];
						}
					});
			}
		});
};

internal.buildAccountConnection = function buildAccountConnection(appId, profile, accessData) {

};
