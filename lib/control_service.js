'use strict';

var utils = require('./utils');
var _ = utils._;
var models = require('./db/models');
var AccountModel = require('./account_model');
var AccountConnectionModel = require('./account_connection_model');

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
