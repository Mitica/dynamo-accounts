'use strict';

// var utils = require('./utils');
// var _ = utils._;
var models = require('./db/models');
var helpers = require('vogels-helpers').control;

/**
 * Creates a new ControlService object.
 * @param {string} appId - Application id
 * @class
 */
function ControlService(appId) {
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

module.exports = ControlService;

ControlService.prototype.createAccount = function(data) {
	data.appId = this.getAppId();
	return helpers.create(models.ACCOUNT_NAME, data, {
		format: 'json',
		keys: ['ukey__id', 'ukey__email', 'ukey__key', 'ukey__username']
	});
};

ControlService.prototype.createAccountConnection = function(data) {
	data.appId = this.getAppId();
	return helpers.create(models.ACCOUNT_CONNECTION_NAME, data, {
		format: 'json',
		keys: ['ukey__id']
	});
};
