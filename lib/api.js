'use strict';

/**
 * Api module
 * @module api
 */

var AccessService = require('./access_service');
var ControlService = require('./control_service');
var providerLogin = require('./provider_login');

/**
 * Api class contructor
 * @param {string} appId - App id
 * @param {AccessService} [access=new AccessService(appId)] - AccessService instance
 * @param {ControlService} [control=new ControlService(appId)] - ControlService instance
 * @class
 */
function Api(appId, access, control) {
	if (!appId) {
		throw new Error('appId is required');
	}

	access = access || new AccessService(appId);
	control = control || new ControlService(appId);

	var data = {
		appId: appId,
		access: access,
		control: control
	};

	this.providerLogin = providerLogin(data);

	Object.defineProperty(this, 'appId', {
		get: function() {
			return appId;
		}
	});
	Object.defineProperty(this, 'access', {
		get: function() {
			return access;
		}
	});
	Object.defineProperty(this, 'control', {
		get: function() {
			return control;
		}
	});
}

/**
 * Creates an Api object
 * @param {string} appId - App id
 * @param {AccessService} [access=new AccessService(appId)] - AccessService instance
 * @param {ControlService} [control=new ControlService(appId)] - ControlService instance
 * @returns {Api}
 */
function api(appId, access, control) {
	return new Api(appId, access, control);
}

module.exports = api;
