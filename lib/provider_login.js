'use strict';

var utils = require('./utils');
var Promise = utils.Promise;
var _ = utils._;
var UserProfile = require('./user_profile');
var AccountConnectionRecord = require('./db/account_connection_record');
var internal = {};

module.exports = function providerLoginCreator(data) {

	function providerLogin(profile, accessData) {
		if (!accessData) {
			return Promise.reject(new Error('accessData is required'));
		}
		if (!_.isString(accessData)) {
			accessData = JSON.stringify(accessData);
		}
		return internal.login(data, profile, accessData);
	}

	return providerLogin;
};

internal.login = function(data, profile, accessData) {
	return internal.findAccountConnection(data, profile, accessData)
		.then(function(connection) {
			if (connection) {
				// console.log('found connection', connection);
				return data.access.getAccount(connection.accountId);
			}
			// console.log('NOT found connection', connection);
			return data.access.newAccountUsername([profile.username, profile.displayName])
				.then(function(username) {
					var accountInfo = UserProfile.convertToAccount(profile);
					accountInfo.username = username;
					accountInfo.appId = data.appId;

					// console.log('creating account', accountInfo);

					return data.control.createAccount(accountInfo)
						.then(function(account) {
							var connectionInfo = UserProfile.convertToAccountConnection(profile);
							connectionInfo.appId = data.appId;
							connectionInfo.accountId = account.id;
							connectionInfo.accessData = accessData;

							// console.log('creating connection', connectionInfo);

							return data.control.createAccountConnection(connectionInfo)
								.then(function() {
									return account;
								});
						});
				});
		});
};

internal.findAccountConnection = function findAccountConnection(data, profile) {
	var info = UserProfile.convertToAccountConnection(profile);
	info.appId = data.appId;

	var id = AccountConnectionRecord.formatId(info);
	// console.log('finding AccountConnection', id, Date.now());
	return data.access.getConnectionsById({
			id: id
		})
		.then(function(itemsById) {
			if (itemsById && itemsById.length > 0) {
				return itemsById[0];
			}
		});
};
