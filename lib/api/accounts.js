'use strict';

var utils = require('../utils');
var _ = utils._;
var providerLogin = require('./provider_login');
var accountsHelpers = require('./accounts_helpers');
var internal = {};

var PUBLIC_NAMES = ['get', 'getItems', 'getByUsername', 'getByKey', 'findOneByUsername', 'findOneByKey'];

module.exports = function accountsCreator(appId) {
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
