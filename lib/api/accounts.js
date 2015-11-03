'use strict';

var providerLogin = require('./provider_login');
var accountsHelpers = require('./accounts_helpers');
var internal = {};

var PUBLIC_NAMES = ['getOne', 'getItems', 'getByUsername', 'findOneByUsername'];

/**
* Creates an Accounts object
* @param {string} appId - App id
*/
module.exports = function accountsCreator(appId) {
	/**
	 * Accounts module
	 * @typedef Accounts
	 */
	var accounts = {
		providerLogin: providerLogin(appId)
	};

	Object.keys(accountsHelpers).forEach(function(key) {
		var fn = accountsHelpers[key];
		if (~PUBLIC_NAMES.indexOf(key)) {
			accounts[key] = internal.bindFunction(appId, fn);
		}
	});

	return accounts;
};

internal.bindFunction = function bindFunction(appId, fn) {
	return function() {
		var params = Array.prototype.slice.call(arguments);
		params = [appId].concat(params);
		return fn.apply(null, params);
	};
};
