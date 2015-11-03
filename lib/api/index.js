'use strict';

/**
 * Api module
 * @module api/index
 */

var utils = require('../utils');
var _ = utils._;

var AccessService = require('../access_service');
var ControlService = require('../control_service');

/**
 * Creates an API object.
 * @param {(string|object)} data - App id or data with services
 * @param {AccessService} [data.access] - AccessService instance
 * @param {ControlService} [data.control] - ControlService instance
 * @returns {Api}
 */
function api(data) {
	if (!data) {
		throw new Error('param `data` is required');
	}
	var access;
	var control;
	var appId;

	if (_.isString(data)) {
		appId = data;
		access = new AccessService(appId);
		control = new ControlService(appId);
	} else {
		access = data.access;
		control = data.control;
		if (!access) {
			throw new Error('param `data.access` is required');
		}
		if (!control) {
			throw new Error('param `data.control` is required');
		}
		appId = access.getAppId();
	}

	data = {
		appId: appId,
		access: access,
		control: control
	};

	/**
	 * Api object
	 * @typedef Api
	 * @type
	 */
	var Api = {
		/**
		 * @readonly
		 */
		get access() {
			return access;
		},
		/**
		 * @readonly
		 */
		get control() {
			return control;
		}
	};

	return Api;
}

module.exports = api;
