'use strict';

// var utils = require('./utils');
// var _ = utils._;
var models = require('./db/models');
var helpers = require('./helpers/control');

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
	return helpers.createModel(models.ACCOUNT_NAME, this.getAppId(), data, ['ukey__id', 'ukey__email', 'ukey__key', 'ukey__username']);
};

ControlService.prototype.createAccountConnection = function(data) {
	return helpers.createModel(models.ACCOUNT_CONNECTION_NAME, this.getAppId(), data, ['ukey__id', 'ukey__email']);
};
