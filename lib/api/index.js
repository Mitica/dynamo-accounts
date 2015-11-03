'use strict';

var utils = require('../utils');
var _ = utils._;

var Accounts = require('./accounts');
var AccountConnections = require('./account_connections');

function api(data) {
	if (!data) {
		throw new Error('param `data` is required');
	}
	var access = data.access;
	var control = data.control;

	// if (!_.isString(data.apiId))

}

module.exports = api;
