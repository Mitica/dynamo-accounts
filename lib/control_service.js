'use strict';

require('./db/models');

var vogels = require('vogels-helpers').control;
var helpers = require('./helpers');

function formatItem(appId, data) {
	return {
		appId: appId,
		data: data
	};
}

/**
 * Creates a new ControlService object.
 * @param {string} appId - Application id
 * @class
 */
function ControlService() {

}

module.exports = ControlService;

ControlService.prototype.createUser = function(appId, data, options) {
	return vogels.create('DA_User', formatItem(appId, data), options)
		.then(helpers.getData);
};

ControlService.prototype.updateUser = function(appId, data, options) {
	options = options || {};
	options.params = options.params || {};

	helpers.formatUpdateExpression(options.params, data);

	return vogels.update('DA_User', formatItem(appId, data), options)
		.then(helpers.getData);
};

ControlService.prototype.createIdentity = function(appId, data, options) {
	return vogels.create('DA_Identity', formatItem(appId, data), options)
		.then(helpers.getData);
};

ControlService.prototype.updateIdentity = function(appId, data, options) {
	options = options || {};
	options.params = options.params || {};

	helpers.formatUpdateExpression(options.params, data);

	return vogels.update('DA_Identity', formatItem(appId, data), options)
		.then(helpers.getData);
};
