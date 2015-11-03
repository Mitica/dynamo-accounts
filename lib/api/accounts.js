'use strict';

/**
 * Accounts module
 * @module api/accounts
 */

var providerLogin = require('./provider_login');
var accountsHelpers = require('./accounts_helpers');
var internal = {};

var PUBLIC_NAMES = ['getOne', 'getItems', 'getByUsername', 'findOneByUsername'];

/**
 * Accounts class
 * @param {object} data - Services
 * @param {string} data.appId - App id
 * @param {AccessService} data.access - AccessService
 * @param {ControlService} data.control - ControlService
 * @class
 */
function Accounts(data) {

	Object.defineProperty(this, 'appId', {
		get: function() {
			return data.appId;
		}
	});
	Object.defineProperty(this, 'access', {
		get: function() {
			return data.access;
		}
	});
	Object.defineProperty(this, 'control', {
		get: function() {
			return data.control;
		}
	});
}

module.exports = Accounts;

Accounts.prototype.getAccount = function() {

};
